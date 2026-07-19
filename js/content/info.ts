import { Dom } from 'datatables.net';
import Button from '../Button';
import { IContentConfig, IContentPlugin } from './content';

export interface IInfoConfig extends IContentConfig {
	/** The action on the button that will trigger the popup */
	activation: 'click' | 'hover';

	/** Button class name */
	className: string;

	/**
	 * Text content. Start with `attr:` to read the content from the header
	 * cell's attribute of the same name
	 */
	content: string;

	/** Class name for the popover */
	contentClass: string;

	/** Pixel gap between the button and the popover */
	gap: number;

	/** The icon to use for the button */
	icon: string;

	/** Button text */
	text: string;
}

export interface IInfo extends Partial<IInfoConfig> {
	extend: 'order';
}

export default {
	defaults: {
		activation: 'hover',
		className: 'info',
		content: 'attr:title',
		contentClass: 'dtcc-popover',
		gap: 10,
		icon: 'info',
		text: ''
	},

	init(config) {
		let dt = this.dt();
		let btn = new Button(dt, this)
			.text(dt.i18n('columnControl.order', config.text))
			.icon(config.icon)
			.className(config.className);

		let buttonEl = Dom.s(btn.element());
		let popover = Dom.c('div').classAdd(config.contentClass);
		let timer;

		if (config.content.match(/^attr:/)) {
			let name = config.content.replace(/^attr:/, '');
			let header = Dom.s(dt.column(this.idx()).header());
			let content = header.attr(name);

			header.attrRemove(name);

			if (!content) {
				return;
			}

			popover.text(content);
		}
		else {
			popover.html(config.content);
		}

		buttonEl.on(
			config.activation === 'hover' ? 'mouseenter' : 'click',
			() => {
				show(popover, buttonEl, config.gap);
			}
		);

		// Hide on exit, but allow a little bit of time for the pointer to get
		// into the popover to keep it in place
		buttonEl.on('mouseleave', () => {
			timer = setTimeout(() => {
				remove(popover);
			}, 250);
		});

		popover
			.on('mouseenter', () => {
				if (timer) {
					clearTimeout(timer);
				}
			})
			.on('mouseleave', () => {
				remove(popover);
			});

		return buttonEl[0];
	}
} as IContentPlugin<IInfoConfig>;

function show(popover: Dom, host: Dom, gap: number) {
	// Set to 0 so we can insert, take measurement (reflow) and reposition if
	// needed, without a flicker
	popover.css('opacity', '0');

	host.parent().append(popover);

	let height = popover.height('outer');
	let width = popover.width('outer');
	let buttonWidth = host.width('outer');
	let buttonHeight = host.height('outer');
	let buttonPosition = host.position();
	let buttonOffset = host.offset();

	popover.css({
		top: -height - gap + 'px',
		left: buttonPosition.left + buttonWidth / 2 - width / 2 + 'px'
	});

	// Check if overflowing top
	if (popover[0].getBoundingClientRect().y < 0) {
		popover.css('top', buttonHeight + gap + 'px').classAdd('below');
	}

	popover.css('opacity', '1');
}

function remove(popover: Dom) {
	popover.detach().classRemove('below');
}
