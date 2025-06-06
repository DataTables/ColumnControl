import Button from '../Button';
import CheckList from '../CheckList';
import { IContentPlugin, IContentConfig } from './content';

export interface IColVisConfig extends IContentConfig {
	/** Container class name */
	className: string;

	/** Column selector for what columns to have in the list */
	columns: string | number | Array<string | number>;

	/** Show the list search input, or not */
	search: boolean;

	/** Show the select all / none buttons, or not */
	select: boolean;

	/** Text shown above the column list */
	title: string;
}

export interface IColVis extends Partial<IColVisConfig> {
	extend: 'colVis';
}

export default {
	defaults: {
		className: 'colVis',
		columns: '',
		search: false,
		select: false,
		title: 'Column visibility'
	},

	init(config) {
		let dt = this.dt();
		let checkList = new CheckList(dt, {
			search: config.search,
			select: config.select
		})
			.title(dt.i18n('columnControl.colVis', config.title))
			.handler((e, btn, buttons) => {
				if (btn) {
					btn.active(!btn.active());
				}

				apply(buttons);
			});

		// Need to apply in a loop to allow for select all / select none
		let apply = (buttons: Button[]) => {
			for (let i=0 ; i<buttons.length ; i++) {
				let btn = buttons[i];
				let idx = btn.value();
				let col = dt.column(idx);

				if (btn.active() && !col.visible()) {
					col.visible(true);
				}
				else if (! btn.active() && col.visible()) {
					col.visible(false);
				}
			}
		};

		let rebuild = () => {
			let columns = dt.columns(config.columns);

			columns.every(function () {
				checkList.add({
					active: this.visible(),
					label: this.title(),
					value: this.index()
				});
			});
		};

		rebuild();

		dt.on('column-visibility', (e, s, colIdx, state) => {
			let btn = checkList.button(colIdx);

			if (btn) {
				btn.active(state);
			}
		});

		dt.on('columns-reordered', (e, details) => {
			checkList.clear();
			rebuild();
		});

		return checkList.element();
	}
} as IContentPlugin<IColVisConfig>;
