import { createElement } from './util';
import icons from './icons';
import { Api } from '../../../types/types';

interface IDom {
	clear: HTMLSpanElement;
	container: HTMLDivElement;
	input: HTMLInputElement;
	inputs: HTMLDivElement;
	searchIcon: HTMLDivElement;
	select: HTMLSelectElement;
	title: HTMLDivElement;
	typeIcon: HTMLDivElement;
}

type ISearch = (type: string, term: string, loadingState: boolean) => void;

export default class SearchInput {
	static classes = {
		container: ['dtcc-content', 'dtcc-search'],
		input: '',
		select: ''
	};

	private _dom: IDom;
	private _search: ISearch;
	private _dt: Api;
	private _idx: number;
	private _lastValue: string;
	private _lastType: string;
	private _loadingState: boolean;
	private _type: string = 'text';

	/**
	 * Add a class to the container
	 *
	 * @param name Class name to add
	 * @returns Self for chaining
	 */
	public addClass(name: string) {
		this._dom.container.classList.add(name);

		return this;
	}

	/**
	 * Clear any applied search
	 *
	 * @returns Self for chaining
	 */
	public clear() {
		this.set(this._dom.select.children[0].getAttribute('value'), '');

		return this;
	}

	/**
	 * Set the clear icon feature can be used or not
	 *
	 * @param set Flag
	 * @returns Self for chaining
	 */
	public clearable(set: boolean) {
		// Note there is no add here as it is added by default and never used after setup, so
		// no need.
		if (!set) {
			this._dom.clear.remove();
		}

		return this;
	}

	/**
	 * Get the container element
	 *
	 * @returns The container element
	 */
	public element() {
		return this._dom.container;
	}

	/**
	 * Get the HTML input element for this control
	 *
	 * @returns HTML Input element
	 */
	public input() {
		return this._dom.input;
	}

	/**
	 * Set the list of options for the dropdown
	 *
	 * @param opts List of options
	 * @returns Self for chaining
	 */
	public options(opts: Array<{ label: string; value: string }>) {
		let select = this._dom.select;

		for (let i = 0; i < opts.length; i++) {
			select.add(new Option(opts[i].label, opts[i].value));
		}

		// Initial icon
		this._dom.typeIcon.innerHTML = icons[opts[0].value];

		return this;
	}

	/**
	 * Set the placeholder attribute for the input element
	 *
	 * @param placeholder Placeholder string
	 * @returns Self for chaining
	 */
	public placeholder(placeholder: string) {
		if (placeholder) {
			let columnTitle = this._dt.column(this._idx).title();

			this._dom.input.placeholder = placeholder.replace('[title]', columnTitle);
		}

		return this;
	}

	/**
	 * Run the search method
	 */
	public runSearch() {
		let dom = this._dom;
		let isActive =
			dom.select.value === 'empty' ||
			dom.select.value === 'notEmpty' ||
			dom.input.value !== '';

		dom.container.classList.toggle('dtcc-search_active', isActive);

		if (
			this._search &&
			(this._lastValue !== dom.input.value || this._lastType !== dom.select.value)
		) {
			this._search(dom.select.value, dom.input.value, this._loadingState);
			this._lastValue = dom.input.value;
			this._lastType = dom.select.value;
		}
	}

	/**
	 * Set the function that will be run when a search operation is required. Note that this can
	 * trigger the function to run if there is a saved state.
	 *
	 * @param fn Search callback
	 * @returns Self for chaining
	 */
	public search(fn: ISearch) {
		this._search = fn;

		// If there is a saved state, load it now that set up is done.
		this._stateLoad(this._dt.state.loaded());

		return this;
	}

	/**
	 * Set a value for the search input
	 *
	 * @param logic Logic type
	 * @param val Value
	 * @returns Self for chaining
	 */
	public set(logic: string, val: string) {
		let dom = this._dom;

		dom.input.value = val;
		dom.select.value = logic;
		dom.typeIcon.innerHTML = icons[dom.select.value];

		this.runSearch();

		return this;
	}

	/**
	 * Set the text that will be shown as the title for the control
	 *
	 * @param text Set the title text
	 * @returns Self for chaining
	 */
	public title(text: string) {
		if (text) {
			let columnTitle = this._dt.column(this._idx).title();

			this._dom.title.innerHTML = text.replace('[title]', columnTitle);
		}

		return this;
	}

	/**
	 * Set the title attribute for the input element
	 *
	 * @param title Title attribute string
	 * @returns Self for chaining
	 */
	public titleAttr(title: string) {
		if (title) {
			let columnTitle = this._dt.column(this._idx).title();

			this._dom.input.title = title.replace('[title]', columnTitle);
		}

		return this;
	}

	public type(t: string) {
		this._type = t;

		return this;
	}

	/**
	 * Create a container element, for consistent DOM structure and styling
	 */
	constructor(dt: Api, idx: number) {
		this._dt = dt;
		this._idx = idx;
		this._dom = {
			clear: createElement<HTMLSpanElement>('span', 'dtcc-search-clear', icons['x']),
			container: createElement<HTMLDivElement>('div', SearchInput.classes.container),
			typeIcon: createElement<HTMLDivElement>('div', 'dtcc-search-type-icon'),
			searchIcon: createElement<HTMLDivElement>('div', 'dtcc-search-icon', icons['search']),
			input: createElement<HTMLInputElement>('input', SearchInput.classes.input),
			inputs: createElement<HTMLDivElement>('div'),
			select: createElement<HTMLSelectElement>('select', SearchInput.classes.select),
			title: createElement<HTMLDivElement>('div', 'dtcc-search-title')
		};

		let dom = this._dom;
		let originalIdx = idx;

		dom.input.setAttribute('type', 'text');
		dom.container.append(dom.title, dom.inputs);
		dom.inputs.append(dom.typeIcon, dom.select, dom.searchIcon, dom.clear, dom.input);

		// Listeners
		let inputInput = () => {
			this.runSearch();
		};

		let selectInput = () => {
			dom.typeIcon.innerHTML = icons[dom.select.value];
			this.runSearch();
		};

		let clearClick = () => {
			this.clear();
		};

		dom.input.addEventListener('input', inputInput);
		dom.select.addEventListener('input', selectInput);
		dom.clear.addEventListener('click', clearClick);

		dt.on('destroy', () => {
			dom.input.removeEventListener('input', inputInput);
			dom.select.removeEventListener('input', selectInput);
			dom.clear.removeEventListener('click', clearClick);
		});

		// State handling - all components that use this class have the same state saving structure
		// so shared handling can be performed here.
		dt.on('stateSaveParams', (e, s, data) => {
			if (!data.columnControl) {
				data.columnControl = {};
			}

			if (!data.columnControl[idx]) {
				data.columnControl[idx] = {};
			}

			data.columnControl[idx].searchInput = {
				logic: dom.select.value,
				type: this._type,
				value: dom.input.value
			};
		});

		dt.on('stateLoaded', (e, s, state) => {
			this._stateLoad(state);
		});

		// Same as for ColumnControl - reassign a column index if needed.
		dt.on('columns-reordered', (e, details) => {
			this._idx = (dt as any).colReorder.transpose(originalIdx, 'fromOriginal');
		});

		// Column control search clearing (column().ccSearchClear() method)
		dt.on('cc-search-clear', (e, colIdx) => {
			if (colIdx === this._idx) {
				// Don't want an automatic redraw on this event
				this._loadingState = true;

				this.clear();

				this._loadingState = false;
			}
		});
	}

	/**
	 * Load a DataTables state
	 *
	 * @param state State object being loaded
	 */
	private _stateLoad(state) {
		let dom = this._dom;
		let idx = this._idx;
		let loadedState = state?.columnControl?.[idx]?.searchInput;

		if (loadedState) {
			// The search callback needs to know if we are loading an existing state or not
			// so it can determine if it needs to draw the table. If it was a user input, then
			// it redraws, if it was a state load, then there should be no redraw.
			this._loadingState = true;

			dom.select.value = loadedState.logic;
			dom.input.value = loadedState.value;

			dom.select.dispatchEvent(new Event('input'));

			this._loadingState = false;
		}
	}
}
