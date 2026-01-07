import { Api } from 'datatables.net';
import Button from './Button';
import ColumnControl from './ColumnControl';
import { createElement } from './util';

export interface IOptions {
	search: boolean;
	select: boolean;
}

interface IDom {
	buttons: HTMLDivElement;
	container: HTMLDivElement;
	controls: HTMLDivElement;
	empty: HTMLDivElement;
	title: HTMLDivElement;
	search: HTMLInputElement;
	selectAll: HTMLButtonElement;
	selectAllCount: HTMLSpanElement;
	selectNone: HTMLButtonElement;
	selectNoneCount: HTMLSpanElement;
}

interface ISettings {
	buttons: Button[];
	dt: Api;
	handler: IHandler;
	host: ColumnControl;
	search: string;
}

export type IHandler = (e: Event, btn: Button, btns: Button[], redraw: boolean) => void;

export interface IOption {
	active?: boolean;
	icon?: string;
	label: string;
	value: string | number;
}

export default class CheckList {
	static classes = {
		container: 'dtcc-list',
		input: 'dtcc-list-search'
	};

	private _dom: IDom;
	private _s: ISettings = {
		buttons: [],
		dt: null,
		handler: () => {},
		host: null,
		search: ''
	};

	/**
	 * Add one or more buttons to the list
	 *
	 * @param options Configuration for the button(s) to add
	 * @returns Self for chaining
	 */
	public add(options: IOption | IOption[], update?: boolean) {
		if (!Array.isArray(options)) {
			options = [options];
		}

		for (let i = 0; i < options.length; i++) {
			let option = options[i];
			let btn = new Button(this._s.dt, this._s.host)
				.active(option.active || false)
				.handler((e) => {
					this._s.handler(e, btn, this._s.buttons, true);
					this._updateCount();
				})
				.icon(option.icon || '')
				.text(option.label !== ''
					? option.label
					: this._s.dt.i18n('columnControl.list.empty', 'Empty')
				)
				.value(option.value);
			
			if (option.label === '') {
				btn.className('empty');
			}

			this._s.buttons.push(btn);
		}

		let count = this._s.buttons.length;

		if (update === true || update === undefined) {
			this._dom.selectAllCount.innerHTML = count ? '(' + count + ')' : '';
			this._redraw();
		}

		return this;
	}

	/**
	 * Find a button with a given value
	 *
	 * @param val Value to search for
	 * @returns Found button
	 */
	public button(val: string | number) {
		let buttons = this._s.buttons;

		for (let i = 0; i < buttons.length; i++) {
			if (buttons[i].value() === val) {
				return buttons[i];
			}
		}

		return null;
	}

	/**
	 * Remove all buttons from the list
	 *
	 * @returns Self for chaining
	 */
	public clear() {
		// Clean up the buttons
		for (let i = 0; i < this._s.buttons.length; i++) {
			this._s.buttons[i].destroy();
		}

		// Then empty them out
		this._dom.buttons.replaceChildren();
		this._s.buttons.length = 0;

		return this;
	}

	/**
	 * Get the DOM container element to attach into the document
	 *
	 * @returns Container
	 */
	public element() {
		return this._dom.container;
	}

	/**
	 * Set the event handler for what happens when a button is clicked
	 *
	 * @param fn Event handler
	 */
	public handler(fn: IHandler) {
		this._s.handler = fn;

		return this;
	}

	/**
	 * Indicate that this is a search control and should listen for corresponding events
	 *
	 * @param dt DataTable instance
	 * @param idx Column index
	 */
	public searchListener(dt: Api) {
		// Column control search clearing (column().columnControl.searchClear() method)
		dt.on('cc-search-clear', (e, colIdx) => {
			if (colIdx === this._s.host.idx()) {
				this.selectNone();

				this._s.handler(e, null, this._s.buttons, false);
				this._s.search = '';
				this._dom.search.value = '';

				this._redraw();
				this._updateCount();
			}
		});

		return this;
	}

	/**
	 * Select all buttons
	 *
	 * @returns Self for chaining
	 */
	public selectAll() {
		for (let i = 0; i < this._s.buttons.length; i++) {
			this._s.buttons[i].active(true);
		}

		return this;
	}

	/**
	 * Deselect all buttons
	 *
	 * @returns Self for chaining
	 */
	public selectNone() {
		for (let i = 0; i < this._s.buttons.length; i++) {
			this._s.buttons[i].active(false);
		}

		return this;
	}

	/**
	 * Set the list's title
	 *
	 * @param title Display title
	 * @returns Button instance
	 */
	public title(title: string) {
		this._dom.title.innerHTML = title;

		return this;
	}

	/**
	 * Get the values that are currently selected in the list
	 *
	 * @returns Array of currently selected options in the list
	 */
	public values(): Array<string | number>;
	/**
	 * Set the activate state of the buttons
	 *
	 * @param values Array of values to set as active
	 */
	public values(values: Array<string | number>): this;
	public values(values?: Array<string | number>): any {
		let i;
		let result = [];
		let buttons = this._s.buttons;

		if (values !== undefined) {
			for (i = 0; i < buttons.length; i++) {
				if (values.includes(buttons[i].value())) {
					buttons[i].active(true);
				}
			}

			this._updateCount();

			return this;
		}

		for (i = 0; i < buttons.length; i++) {
			if (buttons[i].active()) {
				result.push(buttons[i].value());
			}
		}

		return result;
	}

	/**
	 * Container for a list of buttons
	 */
	constructor(dt: Api, host: ColumnControl, opts: IOptions) {
		this._s.dt = dt;
		this._s.host = host;
		this._dom = {
			buttons: createElement<HTMLDivElement>('div', 'dtcc-list-buttons'),
			container: createElement<HTMLDivElement>('div', CheckList.classes.container),
			controls: createElement<HTMLDivElement>('div', 'dtcc-list-controls'),
			empty: createElement<HTMLDivElement>(
				'div',
				'dtcc-list-empty',
				dt.i18n('columnControl.list.empty', 'No options')
			),
			title: createElement<HTMLDivElement>('div', 'dtcc-list-title'),
			selectAll: createElement<HTMLButtonElement>(
				'button',
				'dtcc-list-selectAll',
				dt.i18n('columnControl.list.all', 'Select all')
			),
			selectAllCount: createElement<HTMLSpanElement>('span'),
			selectNone: createElement<HTMLButtonElement>(
				'button',
				'dtcc-list-selectNone',
				dt.i18n('columnControl.list.none', 'Deselect')
			),
			selectNoneCount: createElement<HTMLSpanElement>('span'),
			search: createElement<HTMLInputElement>('input', CheckList.classes.input)
		};

		let dom = this._dom;

		dom.search.setAttribute('type', 'text');
		dom.container.append(dom.title);
		dom.container.append(dom.controls);
		dom.container.append(dom.empty);
		dom.container.append(dom.buttons);

		if (opts.select) {
			dom.controls.append(dom.selectAll);
			dom.controls.append(dom.selectNone);
			dom.selectAll.append(dom.selectAllCount);
			dom.selectNone.append(dom.selectNoneCount);

			dom.selectAll.setAttribute('type', 'button');
			dom.selectNone.setAttribute('type', 'button');
		}

		// Events
		let searchInput = () => {
			this._s.search = dom.search.value;
			this._redraw();
		};

		let selectAllClick = (e: MouseEvent) => {
			this.selectAll();
			this._s.handler(e, null, this._s.buttons, true);
			this._updateCount();
		};

		let selectNoneClick = (e: MouseEvent) => {
			this.selectNone();
			this._s.handler(e, null, this._s.buttons, true);
			this._updateCount();
		};

		if (opts.search) {
			dom.controls.append(dom.search);
			dom.search.setAttribute(
				'placeholder',
				dt.i18n('columnControl.list.search', 'Search...')
			);

			dom.search.addEventListener('input', searchInput);
		}

		dom.selectAll.addEventListener('click', selectAllClick);
		dom.selectNone.addEventListener('click', selectNoneClick);

		dt.on('destroy', () => {
			dom.selectAll.removeEventListener('click', selectAllClick);
			dom.selectNone.removeEventListener('click', selectNoneClick);
			dom.search.removeEventListener('input', searchInput);
		});
	}

	/**
	 * Update the deselect counter
	 */
	private _updateCount() {
		let count = this.values().length;

		this._dom.selectNoneCount.innerHTML = count ? '(' + count + ')' : '';
	}

	/**
	 * Add the buttons to the page - taking into account filtering
	 */
	private _redraw() {
		let buttons = this._s.buttons;
		let el = this._dom.buttons;
		let searchTerm = this._s.search.toLowerCase();

		el.replaceChildren();

		for (let i = 0; i < buttons.length; i++) {
			let btn = buttons[i];

			if (
				!searchTerm ||
				btn
					.text()
					.toLowerCase()
					.includes(searchTerm)
			) {
				el.appendChild(btn.element());
			}
		}

		this._dom.empty.style.display = buttons.length === 0 ? 'block' : 'none';
		el.style.display = buttons.length > 0 ? 'block' : 'none';
	}
}
