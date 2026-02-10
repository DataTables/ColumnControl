import DataTable, { Api, Context } from 'datatables.net';
import ColumnControl, { IConfig } from './ColumnControl';
import { createElement } from './util';

// Use the internal settings objects for DataTables to store information for CC
declare module 'datatables.net' {
	interface ColumnContext {
		/**
		 * Function to update the list of options for a search list
		 */
		columnControlSearchList: (options: any) => void;
	}

}

if (!DataTable || !DataTable.versionCheck || !DataTable.versionCheck('3')) {
	throw 'Warning: ColumnControl requires DataTables 3 or greater';
}

const dom = DataTable.dom;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API integration
 */
(DataTable as any).ColumnControl = ColumnControl;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables listeners for initialisation
 */

// Create header / footer rows that don't exist, but have been referenced in the ColumnControl
// targets. This needs to be done _before_ the header / footer structure is detected.
dom.s(document).on('i18n.dt', function (e, settings: Context) {
	if (e.namespace !== 'dt') {
		return;
	}

	let api = new DataTable.Api(settings);
	let thead = api.table().header();
	let tableInit = (settings.init as any).columnControl as IConfig;
	let defaultInit = ColumnControl.defaults;
	let baseTargets = [];
	let ackTargets = {};

	// Determine if there is only one header row initially. If there is, we might append more
	// after it. Mark the top row as the header row using `titleRow` in the DataTables configuration
	if (thead.querySelectorAll('tr').length <= 1 && settings.titleRow === null) {
		settings.titleRow = 0;
	}

	identifyTargets(baseTargets, tableInit);

	if (ColumnControl.defaults.content) {
		identifyTargets(baseTargets, defaultInit);
	}

	api.columns().every(function (i) {
		let columnInit: IConfig = (this.init() as any).columnControl;

		identifyTargets(baseTargets, columnInit);
	});

	for (let i = 0; i < baseTargets.length; i++) {
		assetTarget(ackTargets, baseTargets[i], api);
	}
});

// Initialisation of ColumnControl instances - has to be done _after_ the header / footer structure
// is detected by DataTables.
dom.s(document).on('preInit.dt', function (e, settings) {
	if (e.namespace !== 'dt') {
		return;
	}

	let api = new DataTable.Api(settings);
	let tableInit: IConfig = settings.init.columnControl;
	let defaultInit = ColumnControl.defaults;
	let baseTargets = [];

	identifyTargets(baseTargets, tableInit);

	// Only add the default target if there is actually content for it
	if (ColumnControl.defaults.content) {
		identifyTargets(baseTargets, defaultInit);
	}

	api.columns().every(function (i) {
		let columnInit: IConfig = (this.init() as any).columnControl;
		let targets = identifyTargets(baseTargets.slice(), columnInit);

		for (let i = 0; i < targets.length; i++) {
			// Each of the column, table and defaults configuration can be an array of config
			// objects, an array of content, or a configuration object. There might be multiple
			// targets for each one, and they might not exist! Therefore this is more complex
			// than it might be desirable.
			let columnTargetInit = getOptionsForTarget(targets[i], columnInit);
			let tableTargetInit = getOptionsForTarget(targets[i], tableInit);
			let defaultTargetInit = getOptionsForTarget(targets[i], defaultInit);

			if (defaultTargetInit || tableTargetInit || columnTargetInit) {
				new ColumnControl(
					api,
					this.index(),
					Object.assign(
						{},
						defaultTargetInit || {},
						tableTargetInit || {},
						columnTargetInit || {}
					)
				);
			}
		}
	});
});

function searchClear() {
	let ctx = this;

	return this.iterator('column', function (settings, idx) {
		// Note that the listeners for this will not redraw the table.
		ctx.trigger('cc-search-clear', [idx]);
	});
}

DataTable.Api.registerPlural(
	'columns().columnControl.searchClear()',
	'column().columnControl.searchClear()',
	searchClear
);

// Legacy (1.0.x)) - was never documented, but was mentioned in the forum
DataTable.Api.registerPlural('columns().ccSearchClear()', 'column().ccSearchClear()', searchClear);

DataTable.Api.registerPlural(
	'columns().columnControl.searchList()',
	'column().columnControl.searchList()',
	function (options) {
		let ctx = this;

		return this.iterator('column', function (settings, idx) {
			let fn = settings.columns[idx].columnControlSearchList;

			if (fn) {
				fn(options);
			}
		});
	}
);

(DataTable.ext.buttons as any).ccSearchClear = {
	text: (dt) => {
		return dt.i18n('columnControl.buttons.searchClear', 'Clear search');
	},
	init: function (dt, node, config) {
		dt.on('draw.DT', () => {
			let enabled = false;
			let glob = !!dt.search();

			// No point in wasting clock cycles if we already know it will be enabled
			if (!glob) {
				dt.columns().every(function () {
					if (
						this.search.fixed('dtcc') ||
						this.search.fixed('dtcc-list') ||
						this.init().__ccList // server-side processing
					) {
						enabled = true;
					}
				});
			}

			this.enable(glob || enabled);
		});

		this.enable(false);
	},
	action: function (e, dt, node, config) {
		dt.search('');
		dt.columns().columnControl.searchClear();
		dt.draw();
	}
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation support - this is more involved than normal as targets might
 * need to be created, and also options needs to be resolved into a standard
 * ColumnControl configuration object, from the various forms allowed in the
 * DataTables configuration.
 */

/**
 * Given a ColumnControl target, make sure that it exists. If not, create it.
 *
 * @param ackTargets Cache for list of targets that have already been found or created
 * @param target Current target
 * @param dt DataTable API
 * @returns Void
 */
function assetTarget(ackTargets, target: number | string, dt: Api) {
	// Check if we already know about the target - if so, we know that it must already be in place
	if (ackTargets[target]) {
		return;
	}

	let isHeader = true; // false for footer
	let row = 0;

	if (typeof target === 'number') {
		row = target;
	}
	else {
		let parts = target.split(':');

		if (parts[0] === 'tfoot') {
			isHeader = false;
		}

		if (parts[1]) {
			row = parseInt(parts[1]);
		}
	}

	// The header / footer have not yet had their structure read, so they aren't available via
	// the API. As such we need to do our own DOM tweaking
	let node = isHeader ? dt.table().header() : dt.table().footer();

	// If the node doesn't exist yet, we need to create it
	if (!node.querySelectorAll('tr')[row]) {
		let columns = dt.columns().count();
		let tr = createElement('tr');

		tr.setAttribute('data-dt-order', 'disable');

		for (let i = 0; i < columns; i++) {
			tr.appendChild(createElement('td'));
		}

		node.appendChild(tr);
	}

	ackTargets[target] = true;
}

/**
 * Given a target, get the config object for it from the parameter passed in
 *
 * @param target ColumnControl target
 * @param input The dev's configuration
 * @returns The resolved config object, if found
 */
function getOptionsForTarget(target, input: any): IConfig | void {
	let defaultTarget = ColumnControl.defaults.target;
	let selfTarget;

	if (isIContentArray(input)) {
		// Top level content array - e.g. `columnControl: ['order']`
		if (defaultTarget === target) {
			return {
				target: defaultTarget,
				content: input
			};
		}
	}
	else if (Array.isArray(input)) {
		// Top level array, some items of which will be configuration objects (possibly not all)
		for (let i = 0; i < input.length; i++) {
			let item = input[i];

			if (isIContentArray(item)) {
				// A content array, e.g. the inner array from: `columnControl: [['order']]
				if (defaultTarget === target) {
					return {
						target: defaultTarget,
						content: item
					};
				}
			}
			else if (isIConfig(item)) {
				// A config object, e.g. the object from: `columnControl: [{content: []}]`
				selfTarget = item.target !== undefined ? item.target : defaultTarget;

				if (target === selfTarget) {
					return item;
				}
			}
			else {
				// A content object
				if (target === defaultTarget) {
					return {
						target: defaultTarget,
						content: input
					};
				}
			}
		}
	}
	else if (typeof input === 'object') {
		// An object can be either a config object, or an extending content object
		if (isIConfig(input)) {
			// Config object: columnControl: {content: []}
			selfTarget = input.target !== undefined ? input.target : defaultTarget;

			if (target === selfTarget) {
				return input;
			}
		}
		else {
			// content object: columnControl: [{extend: 'order'}]
			if (target === defaultTarget) {
				return {
					target: defaultTarget,
					content: input
				};
			}
		}
	}
}

/**
 * Get a list of all targets from the configuration objects / arrays
 *
 * @param targets Established list of targets - mutated
 * @param input Configuration object / array
 * @returns Updated array
 */
function identifyTargets(targets: any[], input: IConfig | IConfig[]) {
	function add(target) {
		if (!targets.includes(target)) {
			targets.push(target);
		}
	}

	if (Array.isArray(input)) {
		if (input.length === 0) {
			// Empty array - assume it is empty content
			add(ColumnControl.defaults.target);
		}
		else {
			// Array of options, or an array of content
			input.forEach((item) => {
				add(
					typeof item === 'object' && item.target !== undefined
						? item.target
						: ColumnControl.defaults.target
				);
			});
		}
	}
	else if (typeof input === 'object') {
		// Full options defined: { target: x, content: [] }
		add(input.target !== undefined ? input.target : ColumnControl.defaults.target);
	}

	return targets;
}

/**
 * Check if an item is a configuration object or not
 *
 * @param item Item to check
 * @returns true if it is a config object
 */
function isIConfig(item: any) {
	return typeof item === 'object' && item.target !== undefined ? true : false;
}

/**
 * Determine if an array contains only content items or not
 *
 * @param arr Array to check
 * @returns true if is content only, false if not (i.e. is an array with configuration objects).
 */
function isIContentArray(arr: any[]) {
	let detectedConfig = false;

	if (!Array.isArray(arr)) {
		return false;
	}

	for (let i = 0; i < arr.length; i++) {
		if (isIConfig(arr[i])) {
			detectedConfig = true;
			break;
		}
	}

	return !detectedConfig;
}
