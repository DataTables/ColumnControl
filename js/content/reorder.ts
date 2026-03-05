import DataTable from 'datatables.net';
import Button from '../Button';
import { IContentConfig, IContentPlugin } from './content';

export interface IReorderConfig extends IContentConfig {
	/** Button class name */
	className: string;

	/** Button icon */
	icon: string;

	/** Button text (shown in dropdown) */
	text: string;
}

export interface IReorder extends Partial<IReorderConfig> {
	extend: 'reorder';
}

export default {
	defaults: {
		className: 'reorder',
		icon: 'move',
		text: 'Reorder columns'
	},

	init(config) {
		let dt = this.dt();
		let btn = new Button(dt, this)
			.text(dt.i18n('columnControl.reorder', config.text))
			.icon(config.icon)
			.className(config.className);

		// The event handling for this is done in ColReorder._addListener - no event
		// handler needed here for click / drag

		if (this.idx() === 0) {
			btn.enable(false);
		}

		dt.on('columns-reordered', (e, details) => {
			btn.enable(this.idx() > 0);
		});

		// If ColReorder wasn't initialised on this DataTable, then we need to add it
		if (!(dt.init() as any).colReorder) {
			new (DataTable as any).ColReorder(dt, {});
		}

		return btn.element();
	}
} as IContentPlugin<IReorderConfig>;
