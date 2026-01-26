import { Api } from 'datatables.net';
import Button from '../Button';
import { addClass, createElement } from '../util';
import { IContentConfig, IContentPlugin } from './content';

interface HTMLDropdown extends HTMLDivElement {
	_shown: boolean;
	_close: () => void;
}

export interface IDropdownConfig extends IContentConfig {
	/**
	 * The first matching element with this selector will be focused on, when
	 * the dropdown is shown. Empty string to disable
	 */
	autoFocus: string;

	/** Button class name */
	className: string;

	/** Content to show in the dropdown */
	content: IContentConfig[];

	/** Class name to assign to the floating dropdown element */
	dropdownClass: string;

	/** Icon name */
	icon: string;

	/** Icon name for icon to display while active */
	iconActive: string;

	/** Button text (shown in an existing dropdown, not at the top level) */
	text: string;
}

export interface IDropdown extends Partial<IDropdownConfig> {
	extend: 'dropdown';
}

export interface IClasses {
	container: string | string[];
	liner: string | string[];
}

interface IEventDropdownClose extends Event {
	_closed: HTMLElement[];
}

/**
 * Close all or only other dropdowns
 *
 * @param e Event or null to close all others
 */
export function close(e: IEventDropdownClose | null = null) {
	document.querySelectorAll<HTMLDropdown>('div.dtcc-dropdown').forEach((el) => {
		if (e === null || !el.contains(e.target as Node)) {
			el._close();

			if (!e._closed) {
				e._closed = [];
			}

			e._closed.push(el);
		}
	});
}

function getContainer(dt: Api, btn: HTMLButtonElement) {
	return btn.closest<HTMLElement>('div.dtfh-floatingparent') || dt.table().container();
}

/**
 * Position the dropdown relative to the button that activated it, with possible corrections
 * to make sure it is visible on the page.
 *
 * @param dropdown Dropdown element
 * @param dt Container DataTable
 * @param btn Button the dropdown emanates from
 */
function positionDropdown(dropdown: HTMLDropdown, dt: Api, btn: HTMLButtonElement) {
	let header = btn.closest('div.dt-column-header');
	let container = getContainer(dt, btn);
	let headerStyle = getComputedStyle(header);
	let dropdownWidth = dropdown.offsetWidth;
	let position = relativePosition(container, btn);
	let left, top;

	top = position.top + btn.offsetHeight;

	if (headerStyle.flexDirection === 'row-reverse') {
		// Icon is on the left of the header - align the left hand sides
		left = position.left;
	}
	else {
		// Icon is on the right of the header - align the right hand sides
		left = position.left - dropdownWidth + btn.offsetWidth;
	}

	// Corrections - don't extend past the DataTable to the left and right
	let containerWidth = container.offsetWidth;

	if (left + dropdownWidth > containerWidth) {
		left -= left + dropdownWidth - containerWidth;
	}

	if (left < 0) {
		left = 0;
	}

	dropdown.style.top = top + 'px';
	dropdown.style.left = left + 'px';
}

/**
 * Display the dropdown in the document
 *
 * @param dropdown Dropdown element
 * @param dt Container DataTable
 * @param btn Button the dropdown emanates from
 * @param autoFocus Selector to run to find if we can focus on an item
 *   automatically
 * @returns Function to call when the dropdown should be removed from the
 *   document
 */
function attachDropdown(dropdown: HTMLDropdown, dt: Api, btn: Button, autoFocus: string) {
	let dtContainer = getContainer(dt, btn.element());

	dropdown._shown = true;
	dtContainer.append(dropdown);
	positionDropdown(dropdown, dt, btn.element());
	btn.element().setAttribute('aria-expanded', 'true');

	// Note that this could be called when the dropdown has already been removed from the document
	// via another dropdown being shown. This will clean up the event on the next body click.
	let removeDropdown = (e) => {
		// Not in document, so just clean up the event handler
		if (!dropdown._shown) {
			document.body.removeEventListener('click', removeDropdown);
			return;
		}

		// If the click is inside the dropdown, ignore it - we don't want to immediately close
		if (e.target === dropdown || dropdown.contains(e.target)) {
			return;
		}

		// If there is currently a datetime picker visible on the page, assume that it belongs to
		// this dropdown. Don't want to close while operating on the picker.
		let datetime = document.querySelector('div.dt-datetime');
		if (datetime && (e.target === datetime || datetime.contains(e.target))) {
			return;
		}

		dropdown._close();
		document.body.removeEventListener('click', removeDropdown);
	};

	document.body.addEventListener('click', removeDropdown);

	// Focus on an input if we can
	if (autoFocus) {
		let el = dropdown.querySelector(autoFocus) as HTMLInputElement;

		if (el) {
			el.focus();
		}
	}

	return removeDropdown;
}

/**
 * Get the position of an element, relative to a given parent. The origin MUST be under the
 * parent's tree.
 *
 * @param parent Parent element to get position relative to
 * @param origin Target element
 */
function relativePosition(parent: HTMLElement, origin: HTMLElement) {
	let top = 0;
	let left = 0;

	while (origin && origin !== parent && origin !== document.body) {
		top += origin.offsetTop;
		left += origin.offsetLeft;

		if (origin.scrollTop) {
			left -= origin.scrollTop;
		}

		if (origin.scrollLeft) {
			left -= origin.scrollLeft;
		}

		origin = origin.offsetParent as HTMLElement;
	}

	return {
		top,
		left
	};
}

/**
 * Function that will provide the keyboard navigation for the dropdown
 *
 * @param dropdown Dropdown element in question
 * @returns Function that can be bound to `keypress`
 */
function focusCapture(dropdown: HTMLDropdown, host: HTMLButtonElement) {
	return function (e: KeyboardEvent) {
		// Do nothing if not shown
		if (!dropdown._shown) {
			return;
		}

		// Focus trap for tab key
		var elements: HTMLElement[] = Array.from(
			dropdown.querySelectorAll('a, button, input, select')
		);
		var active = document.activeElement as HTMLElement;

		// An escape key should close the dropdown
		if (e.key === 'Escape') {
			dropdown._close();
			host.focus(); // Restore focus to the host

			return;
		}
		else if (e.key !== 'Tab' || elements.length === 0) {
			// Anything other than tab we aren't interested in from here
			return;
		}

		if (!elements.includes(active)) {
			// If new focus is not inside the popover we want to drag it back in
			elements[0].focus();
			e.preventDefault();
		}
		else if (e.shiftKey) {
			// Reverse tabbing order when shift key is pressed
			if (active === elements[0]) {
				elements[elements.length - 1].focus();
				e.preventDefault();
			}
		}
		else {
			if (active === elements[elements.length - 1]) {
				elements[0].focus();
				e.preventDefault();
			}
		}
	};
}

const dropdownContent = {
	classes: {
		container: 'dtcc-dropdown',
		liner: 'dtcc-dropdown-liner'
	},

	defaults: {
		autoFocus: 'div.dtcc-search input',
		className: 'dropdown',
		dropdownClass: '',
		content: [],
		icon: 'menu',
		iconActive: '',
		text: 'More...'
	},

	init(config) {
		let dt = this.dt();
		let dropdown = createElement<HTMLDropdown>('div', dropdownContent.classes.container, '', [
			createElement('div', dropdownContent.classes.liner)
		]);

		dropdown._shown = false;
		dropdown._close = () => {
			dropdown.remove();
			dropdown._shown = false;

			btn.element().setAttribute('aria-expanded', 'false');
		};
		dropdown.setAttribute('role', 'dialog');
		dropdown.setAttribute('aria-label', dt.i18n('columnControl.dropdown', config.text));

		if (config.dropdownClass) {
			addClass(dropdown, config.dropdownClass.split(' '));
		}

		// When FixedHeader is used, the transition between states messes up positioning, so if
		// shown we just reattach the dropdown.
		dt.on('fixedheader-mode', () => {
			if (dropdown._shown) {
				attachDropdown(dropdown, dt, config._parents ? config._parents[0] : btn, config.autoFocus);
			}
		});

		// A liner element allows more styling options, so the contents go inside this
		let liner = dropdown.childNodes[0] as HTMLDivElement;

		let btn = new Button(dt, this)
			.text(dt.i18n('columnControl.dropdown', config.text))
			.icon(config.icon, config.iconActive)
			.className(config.className)
			.dropdownDisplay(liner)
			.handler((e: IEventDropdownClose) => {
				// Do nothing if our dropdown was just closed as part of the event (i.e. allow
				// the button to toggle it closed)
				if (e._closed && e._closed.includes(dropdown)) {
					return;
				}

				attachDropdown(dropdown, dt, config._parents ? config._parents[0] : btn, config.autoFocus);

				// When activated using a key - auto focus on the first item in the popover
				let focusable = dropdown.querySelector('input, a, button') as any;

				if (focusable && e.type === 'keypress') {
					focusable.focus();
				}
			});

		btn.element().setAttribute('aria-haspopup', 'dialog');
		btn.element().setAttribute('aria-expanded', 'false');

		// Add the content for the dropdown
		for (let i = 0; i < config.content.length; i++) {
			let content = this.resolve(config.content[i]);

			// For nested items we need to keep a reference to the top level so the sub-levels
			// can communicate back - e.g. active or positioned relative to that top level.
			if (!content.config._parents) {
				content.config._parents = [];
			}

			content.config._parents.push(btn);

			let el = content.plugin.init.call(this, content.config);

			liner.appendChild(el);
		}

		// For nested dropdowns, add an extra icon element to show that it will dropdown further
		if (config._parents && config._parents.length) {
			btn.extra('chevronRight');
		}

		// Reposition if needed
		dt.on('columns-reordered', () => {
			positionDropdown(dropdown, dt, btn.element());
		});

		// Focus capture events
		let capture = focusCapture(dropdown, btn.element());
		document.body.addEventListener('keydown', capture);

		dt.on('destroy', () => {
			document.body.removeEventListener('keydown', capture);
		});

		return btn.element();
	}
} as IContentPlugin<IDropdownConfig, IClasses>;

export default dropdownContent;
