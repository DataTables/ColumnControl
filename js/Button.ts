import { Api } from 'datatables.net';
import ColumnControl from './ColumnControl';
import { close as closeDropdowns } from './content/dropdown';
import icons from './icons';
import { createElement } from './util';

type Icons = keyof typeof icons;

interface IDom {
	button: HTMLButtonElement;
	dropdownDisplay: HTMLDivElement;
	icon: HTMLSpanElement;
	extra: HTMLSpanElement;
	state: HTMLSpanElement;
	text: HTMLSpanElement;
}

interface ISettings {
	active: boolean;
	activeList: { [key: number]: boolean };
	buttonClick: EventListener;
	dt: Api;
	enabled: boolean;
	host: ColumnControl;
	label: string;
	namespace: string;
	value: string | number;
}

let _namespace = 0;

export default class Button {
	static classes = {
		container: 'dtcc-button'
	};

	private _dom: IDom;
	private _s: ISettings = {
		active: false,
		activeList: [],
		buttonClick: null,
		dt: null,
		enabled: true,
		host: null,
		label: '',
		namespace: '',
		value: null
	};

	/**
	 * Get the active state of the button
	 */
	public active(): boolean;

	/**
	 * Set the active state of the button
	 *
	 * @param active The active state
	 * @returns Button instance
	 */
	public active(active: boolean): this;
	public active(active?: boolean): any {
		if (active === undefined) {
			return this._s.active;
		}

		this._s.active = active;
		this._checkActive();

		return this;
	}

	/**
	 * A button can be marked as active by any of its sub-buttons (i.e. if it is a dropdown)
	 * and each one needs to be able to enable this button without effecting the active state
	 * trigged by any other sub-buttons. This method provides a way to do that.
	 *
	 * @param unique Unique id for the activate state
	 * @param active If it is active
	 * @returns Button instance
	 */
	public activeList(unique: number, active: boolean) {
		this._s.activeList[unique] = active;
		this._checkActive();

		return this;
	}

	/**
	 * Scan over the dropdown element looking for any visible content. If there isn't any then
	 * we hide this button.
	 *
	 * @returns Button instance
	 */
	public checkDisplay() {
		let visible = 0;
		let children = this._dom.dropdownDisplay.childNodes as any;

		for (let i = 0; i < children.length; i++) {
			// No need to getComputedStyle since if a button is hidden, it was done with JS writing
			// to style.display, so we can check against that.
			if (children[i].style.display !== 'none') {
				visible++;
			}
		}

		if (visible === 0) {
			this._dom.button.style.display = 'none';
		}

		return this;
	}

	/**
	 * Set the class name for the button
	 *
	 * @param className Class name
	 * @returns Button instance
	 */
	public className(className: string) {
		this._dom.button.classList.add('dtcc-button_' + className);

		return this;
	}

	/**
	 * Destroy the button, cleaning up event listeners
	 */
	public destroy() {
		if (this._s.buttonClick) {
			this._dom.button.removeEventListener('click', this._s.buttonClick);
			this._dom.button.removeEventListener('keypress', this._s.buttonClick);
		}

		this._s.host.destroyRemove(this);
	}

	/**
	 * Relevant for drop downs only. When a button in a dropdown is hidden, we might want to
	 * hide the host button as well (if it has nothing else to show). For that we need to know
	 * what the dropdown element is.
	 *
	 * @param el Element that can be used for telling us about drop down elements.
	 * @returns Button instance
	 */
	public dropdownDisplay(el: HTMLDivElement) {
		this._dom.dropdownDisplay = el;

		return this;
	}

	/**
	 * Get the DOM Button element to attach into the document
	 *
	 * @returns The Button element
	 */
	public element() {
		return this._dom.button;
	}

	/**
	 * Get the current enabled state for the button
	 */
	public enable(): boolean;
	/**
	 * Set if the button should be enabled or not.
	 *
	 * @param enable Toggle the enable state
	 * @returns Button instance
	 */
	public enable(enable: boolean): this;
	public enable(enable?: boolean) {
		if (enable === undefined) {
			return this._s.enabled;
		}

		this._dom.button.classList.toggle('dtcc-button_disabled', !enable);
		this._s.enabled = enable;

		return this;
	}

	/**
	 * Set the extra information icon
	 *
	 * @param icon Icon name
	 * @returns Button instance
	 */
	public extra(icon: Icons | '') {
		this._dom.extra.innerHTML = icon ? icons[icon] : '';

		return this;
	}

	/**
	 * Set the event handler for when the button is activated
	 *
	 * @param fn Event handler
	 * @returns Button instance
	 */
	public handler(fn: (e: Event) => void) {
		let buttonClick = (e) => {
			// Close any dropdowns which are already open
			closeDropdowns(e);

			// Stop bubbling to the DataTables default header, which  might still be enabled
			e.stopPropagation();
			e.preventDefault();

			if (this._s.enabled) {
				fn(e);
			}
		};

		this._s.buttonClick = buttonClick;
		this._s.namespace = 'dtcc-' + _namespace++;
		this._dom.button.addEventListener('click', buttonClick);
		this._dom.button.addEventListener('keypress', buttonClick);

		this._s.host.destroyAdd(this);

		return this;
	}

	/**
	 * Set the icon to display in the button
	 *
	 * @param icon Icon name
	 * @returns Button instance
	 */
	public icon(icon: string) {
		this._dom.icon.innerHTML = icon ? icons[icon] : '';

		return this;
	}

	/**
	 * Get the text for the button
	 */
	public text(): string;
	/**
	 * Set the text to appear in the button
	 *
	 * @param text Text to appear in the button
	 * @returns Button instance
	 */
	public text(text: string): this;
	public text(text?: string): any {
		if (text === undefined) {
			return this._s.label;
		}

		this._dom.text.innerHTML = text;
		this._s.label = text; // for fast retrieval

		this._dom.button.setAttribute('aria-label', text);

		return this;
	}

	/**
	 * Get the value for this button (if one is set)
	 */
	public value(): string | number;
	/**
	 * Set the value for the button
	 *
	 * @param val Value to set
	 */
	public value(val: string | number): Button;
	public value(val?: string | number): any {
		if (val === undefined) {
			return this._s.value;
		}

		this._s.value = val;

		return this;
	}

	/**
	 * Create a new button for use in ColumnControl contents. Buttons created by this class can be
	 * used at the top level in the header or in a dropdown.
	 */
	constructor(dt: Api, host: ColumnControl) {
		this._s.dt = dt;
		this._s.host = host;
		this._dom = {
			button: createElement<HTMLButtonElement>('button', Button.classes.container),
			dropdownDisplay: null,
			extra: createElement<HTMLSpanElement>('span', 'dtcc-button-extra'),
			icon: createElement<HTMLSpanElement>('span', 'dtcc-button-icon'),
			state: createElement<HTMLSpanElement>('span', 'dtcc-button-state'),
			text: createElement<HTMLSpanElement>('span', 'dtcc-button-text')
		};

		this._dom.button.setAttribute('type', 'button');
		this._dom.button.append(this._dom.icon);
		this._dom.button.append(this._dom.text);
		this._dom.button.append(this._dom.state);
		this._dom.button.append(this._dom.extra);

		// Default state is enabled
		this.enable(true);
	}

	/**
	 * Check if anything is making this button active
	 *
	 * @returns Self for chaining
	 */
	private _checkActive() {
		if (this._s.active === true || Object.values(this._s.activeList).includes(true)) {
			this._dom.state.innerHTML = icons.tick;
			this._dom.button.classList.add('dtcc-button_active');
		}
		else {
			this._dom.state.innerHTML = '';
			this._dom.button.classList.remove('dtcc-button_active');
		}

		return this;
	}
}
