import CheckList from '../CheckList';
import { IContentPlugin, IContentConfig } from './content';

export interface ISearchListConfig extends IContentConfig {
	/** Only use SearchList on columns where the options are defined by the Ajax data */
	ajaxOnly: boolean;

	/** Container class name */
	className: string;

	/** Define if a search list can be hidden if there is no data that comes back from the server
	 * for it. Applies to Ajax options only (`ajaxOnly: true`).
	 */
	hidable: boolean;

	/** List of options. If not given here, will be derived from Ajax data, or the table's data */
	options: Array<{ label: string; value: any }> | null;

	/** Show the list search input, or not */
	search: boolean;

	/** Show the select all / none buttons, or not */
	select: boolean;

	/** Text shown above the search list. `[title]` will be replaced by the column title. */
	title: string;
}

export interface ISearchList extends Partial<ISearchListConfig> {
	extend: 'searchList';
}

/** Set the options to show in the list */
function setOptions(checkList: CheckList, opts) {
	let existing = checkList.values();

	checkList.clear();

	for (let i = 0; i < opts.length; i++) {
		if (typeof opts[i] === 'object') {
			checkList.add(
				{
					active: false,
					label: opts[i].label,
					value: opts[i].value
				},
				i === opts.length - 1
			);
		}
		else {
			checkList.add(
				{
					active: false,
					label: opts[i],
					value: opts[i]
				},
				i === opts.length - 1
			);
		}
	}

	if (existing.length) {
		checkList.values(existing);
	}
}

/** Load a saved state */
function getState(columnIdx: number, state) {
	let loadedState = state?.columnControl?.[columnIdx]?.searchList;

	if (loadedState) {
		return loadedState;
	}
}

/** Get the options for a column from a DT JSON object */
export function getJsonOptions(dt, idx) {
	let json = (dt.ajax.json() as any)?.columnControl;
	let column = dt.column(idx);
	let name = column.name();
	let dataSrc = column.dataSrc();

	if (json && json[name]) {
		// Found options matching the column's name - top priority
		return json[name];
	}
	else if (json && typeof dataSrc === 'string' && json[dataSrc]) {
		// Found options matching the column's data source string
		return json[dataSrc];
	}
	else if (json && json[idx]) {
		// Found options matching the column's data index
		return json[idx];
	}

	return null;
}

function reloadOptions(dt, config, idx, checkList, loadedValues) {
	// Was there options specified in the Ajax return?
	let json = (dt.ajax.json() as any)?.columnControl;
	let options = [];
	let jsonOptions = getJsonOptions(dt, idx);

	if (jsonOptions) {
		options = jsonOptions;
	}
	else if (json && config.ajaxOnly) {
		if (config.hidable) {
			// Ajax only options - need to hide the search list
			checkList.element().style.display = 'none';

			// Check if the parent buttons should be hidden as well (they will be if there
			// is no visible content in them)
			if (config._parents) {
				config._parents.forEach((btn) => btn.checkDisplay());
			}
		}

		// No point in doing any further processing here
		return;
	}
	else {
		// Either no ajax object (i.e. not an Ajax table), or no matching ajax options
		// for this column - get the values for the column, taking into account
		// orthogonal rendering
		let found = {};
		let rows = dt.rows({ order: idx }).indexes().toArray();
		let settings = dt.settings()[0];

		for (let i=0 ; i<rows.length ; i++) {
			let raw = settings.fastData(rows[i], idx, 'filter');
			let filter = raw !== null && raw !== undefined
				? raw.toString()
				: '';

			if (!found[filter]) {
				found[filter] = true;

				options.push({
					label: settings.fastData(rows[i], idx, 'display'),
					value: filter
				});
			}
		}
	}

	setOptions(checkList, options);

	// If there was a state loaded at start up, then we need to set the visual
	// appearance to match
	if (loadedValues) {
		checkList.values(loadedValues);
	}
}

export default {
	defaults: {
		ajaxOnly: true,
		className: 'searchList',
		hidable: true,
		options: null,
		search: true,
		select: true,
		title: ''
	},

	init(config) {
		let loadedValues = null;
		let dt = this.dt();

		// The search can be applied from a stored start at start up before the options are
		// available. It can also be applied by user input, so it is generalised into this function.
		let applySearch = (values) => {
			let col = dt.column(this.idx());

			if (!values) {
				return;
			}
			else if (values.length === 0) {
				// Nothing selected - clear the filter
				col.search.fixed('dtcc-list', '');
			}
			else {
				// Find all matching options from the list of values
				col.search.fixed('dtcc-list', (val) => {
					return values.includes(val);
				});
			}

			// If in a dropdown, set the parent levels as active
			if (config._parents) {
				config._parents.forEach((btn) => btn.activeList(this.unique(), !!values.length));
			}
		};

		let checkList = new CheckList(dt, {
			search: config.search,
			select: config.select
		})
			.searchListener(dt, this)
			.title(
				dt
					.i18n('columnControl.searchList', config.title)
					.replace('[title]', dt.column(this.idx()).title())
			)
			.handler((e, btn, btns, redraw) => {
				if (btn) {
					btn.active(!btn.active());
				}

				applySearch(checkList.values());

				if (redraw) {
					dt.draw();
				}
			});

		if (config.options) {
			setOptions(checkList, config.options);
		}
		else {
			dt.ready(() => {
				reloadOptions(dt, config, this.idx(), checkList, loadedValues);
			});
		}

		// Xhr event listener for updates of options
		dt.on('xhr', (e, s, json) => {
			// Need to wait for the draw to complete so the table has the latest data
			dt.one('draw', () => {
				reloadOptions(dt, config, this.idx(), checkList, loadedValues);
			});
		});

		// Unlike the SearchInput based search contents, CheckList does not handle state saving
		// (since the mechanism for column visibility is different), so state saving is handled
		// here.
		dt.on('stateLoaded', (e, s, state) => {
			let values = getState(this.idx(), state);

			if (values) {
				checkList.values(values);
				applySearch(values);
			}
		});

		dt.on('stateSaveParams', (e, s, data) => {
			let idx = this.idx();

			if (!data.columnControl) {
				data.columnControl = {};
			}

			if (!data.columnControl[idx]) {
				data.columnControl[idx] = {};
			}

			// If the table isn't yet ready, then the options for the list won't have been
			// populated (above) and therefore there can't be an values. In such a case
			// use the last saved values and this will refresh on the next draw.
			data.columnControl[idx].searchList = dt.ready()
				? checkList.values()
				: loadedValues;
		});

		loadedValues = getState(this.idx(), dt.state.loaded());
		applySearch(loadedValues);

		return checkList.element();
	}
} as IContentPlugin<ISearchListConfig>;
