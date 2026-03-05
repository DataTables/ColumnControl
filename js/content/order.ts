import Button from '../Button';
import { IContentConfig, IContentPlugin } from './content';

export interface IOrderConfig extends IContentConfig {
	/** Button class name */
	className: string;

	/** Icon to use for when there is ascending ordering applied to the column */
	iconAsc: string;

	/** Icon to use for when there is descending ordering applied to the column */
	iconDesc: string;

	/** Icon to use for when there is no ordering applied to the column */
	iconNone: string;

	/** Don't add the click listener if enabled */
	statusOnly: boolean;

	/** Button text (shown in dropdowns) */
	text: string;
}

export interface IOrder extends Partial<IOrderConfig> {
	extend: 'order';
}

export default {
	defaults: {
		className: 'order',
		iconAsc: 'orderAsc',
		iconDesc: 'orderDesc',
		iconNone: 'orderNone',
		statusOnly: false,
		text: 'Toggle ordering'
	},

	init(config) {
		let dt = this.dt();
		let btn = new Button(dt, this)
			.text(dt.i18n('columnControl.order', config.text))
			.icon('orderAsc')
			.className(config.className);

		if (!config.statusOnly) {
			dt.order.listener(
				btn.element(),
				() => [this.idx()],
				() => {}
			);
		}

		dt.on('order', (e, s, order) => {
			let found = order.find((o) => o.col === this.idx());

			if (!found) {
				btn.active(false).icon(config.iconNone);
			}
			else if (found.dir === 'asc') {
				btn.active(true).icon(config.iconAsc);
			}
			else if (found.dir === 'desc') {
				btn.active(true).icon(config.iconDesc);
			}
		});

		return btn.element();
	}
} as IContentPlugin<IOrderConfig>;
