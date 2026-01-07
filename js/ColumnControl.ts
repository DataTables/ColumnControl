import { Api } from 'datatables.net';
import Button from './Button';
import CheckList from './CheckList';
import { IContentPlugin } from './content/content';
import contentTypes, { IContentConfig } from './content/index';
import icons from './icons';
import SearchInput from './SearchInput';
import { addClass } from './util';

export type TContentItem = IContentConfig | keyof typeof contentTypes | TContentItem[];

export interface IDefaults {
	className: string | string[];
	target: number | string;
	content: null | TContentItem[];
}

export interface IConfig extends Partial<IDefaults> {}

export interface IContents {
	[name: string]: IContentPlugin;
}

export interface IDom {
	target: HTMLElement;
	wrapper: HTMLSpanElement;
}

interface ISettings {
	columnIdx: number;
	unique: number;
	toDestroy: any[];
}

/**
 *
 */
export default class ColumnControl {
	private _dom: IDom = {
		target: null,
		wrapper: null
	};

	private _dt: Api;

	private _c: IConfig = {};

	private _s: ISettings = {
		columnIdx: null,
		unique: null,
		toDestroy: []
	};

	/**
	 * Add a component to the destroy list. This is so there is a single destroy event handler,
	 * which is much better for performance.
	 *
	 * @param component Any instance with a `destroy` method
	 */
	public destroyAdd(component: any) {
		this._s.toDestroy.push(component);
	}

	/**
	 * Remove an instance from the destroy list (it has been destroyed itself)
	 *
	 * @param component Any instance with a `destroy` method
	 */
	public destroyRemove(component: any) {
		let idx = this._s.toDestroy.indexOf(component);

		if (idx !== -1) {
			this._s.toDestroy.splice(idx, 1);
		}
	}

	/**
	 * Get the DataTables API instance that hosts this instance of ColumnControl
	 *
	 * @returns DataTables API instance
	 */
	public dt() {
		return this._dt;
	}

	/**
	 * Get what column index this instance of ColumnControl is operating on
	 *
	 * @returns Column index
	 */
	public idx() {
		return this._s.columnIdx;
	}

	/**
	 * Covert the options from `content` in the DataTable initialisation for this instance into a
	 * resolved plugin and options.
	 *
	 * @param content The dev's supplied configuration for the content
	 * @returns Resolved plugin information
	 */
	public resolve(content: string | any) {
		let plugin: IContentPlugin = null;
		let config: any = null;
		let type: string = null;

		if (typeof content === 'string') {
			// Simple content - uses default options
			type = content;
			plugin = ColumnControl.content[type];
			config = Object.assign({}, plugin?.defaults);
		}
		else if (Array.isArray(content)) {
			// An array is a shorthand for a dropdown with its default options
			type = 'dropdown';
			plugin = ColumnControl.content[type];
			config = Object.assign({}, plugin?.defaults, {
				content: content
			});
		}
		else if (content.extend) {
			// Content with custom options
			type = content.extend;
			plugin = ColumnControl.content[type];
			config = Object.assign({}, plugin?.defaults, content);
		}

		if (!plugin) {
			throw new Error('Unknown ColumnControl content type: ' + type);
		}

		// If the plugin is a wrapper around another type - e.g. the colVisDropdown
		if (plugin.extend) {
			let self = plugin.extend.call(this, config);

			return this.resolve(self);
		}

		return {
			config,
			type,
			plugin
		};
	}

	/**
	 * Get the unique id for the instance
	 *
	 * @returns Instant unique id
	 */
	public unique() {
		return this._s.unique;
	}

	/**
	 * Create a new ColumnControl instance to control a DataTables column.
	 *
	 * @param dt DataTables API instance
	 * @param columnIdx Column index to operation on
	 * @param opts Configuration options
	 */
	constructor(dt: Api, columnIdx: number, opts: IConfig) {
		this._dt = dt;
		this._s.columnIdx = columnIdx;
		this._s.unique = Math.random();

		let originalIdx = columnIdx;

		Object.assign(this._c, ColumnControl.defaults, opts);

		this._dom.target = this._target();

		if (opts.className) {
			addClass(this._dom.target.closest('tr'), opts.className);
		}

		if (this._c.content) {
			// If column reordering can be done, we reassign the column index here, and before the
			// plugins can add their own listeners.
			dt.on('columns-reordered', (e, details) => {
				this._s.columnIdx = (dt as any).colReorder.transpose(originalIdx, 'fromOriginal');
			});

			this._dom.wrapper = document.createElement('span');
			this._dom.wrapper.classList.add('dtcc');
			this._dom.target.appendChild(this._dom.wrapper);

			this._c.content.forEach((content) => {
				let { plugin, config } = this.resolve(content);
				let el = plugin.init.call(this, config);

				this._dom.wrapper.appendChild(el);
			});

			dt.on('destroy', () => {
				this._s.toDestroy.slice().forEach(el => {
					el.destroy();
				});

				this._dom.wrapper.remove();
			});
		}
	}

	/**
	 * Resolve the configured target into a DOM element
	 */
	private _target() {
		let target = this._c.target;
		let column = this._dt.column(this._s.columnIdx);
		let node: HTMLElement;
		let className = 'header';

		// Header row index
		if (typeof target === 'number') {
			node = column.header(target);
		}
		else {
			let parts = target.split(':');
			let isHeader = parts[0] === 'tfoot' ? false : true;
			let row = parts[1] ? parseInt(parts[1]) : 0;

			if (isHeader) {
				node = column.header(row);
			}
			else {
				node = column.footer(row);
				className = 'footer';
			}
		}

		return node.querySelector<HTMLElement>('div.dt-column-' + className);
	}

	// Classes for common UI
	static Button = Button;

	static CheckList = CheckList;

	static SearchInput = SearchInput;

	/** Content plugins */
	static content: IContents = contentTypes;

	/** Defaults for ColumnControl */
	static defaults: IDefaults = {
		className: '',

		content: null,

		target: 0,
	};

	/** SVG icons that can be used by the content plugins */
	static icons = icons;

	/** Version */
	static version = '1.2.0';
}
