import { IContentPlugin } from './content';
import searchDateTime, { ISearchDateTimeConfig } from './searchDateTime';
import searchList, { ISearchListConfig, getJsonOptions } from './searchList';
import searchNumber, { ISearchNumberConfig } from './searchNumber';
import searchText, { ISearchTextConfig } from './searchText';

export interface ISearchConfig
	extends ISearchDateTimeConfig,
		ISearchNumberConfig,
		ISearchTextConfig,
		ISearchListConfig {
	/** Indicate if SearchList should be allowed or not (it is only used for Ajax loaded data) */
	allowSearchList: boolean;
}

export interface ISearch extends Partial<ISearchConfig> {
	extend: 'search';
}

export default {
	defaults: {
		allowSearchList: false
	},

	init(config) {
		let dt = this.dt();
		let idx = this.idx();
		let displayEl;
		let loadedState = (dt.state.loaded() as any)?.columnControl?.[idx];

		let initType = (type: string) => {
			let json = getJsonOptions(dt, idx);

			// Attempt to match what type of search should be shown
			if (type === 'list' || (config.allowSearchList && json)) {
				// We've got a list of JSON options, and are allowed to show the searchList
				return searchList.init.call(this, Object.assign({}, searchList.defaults, config));
			}
			else if (type === 'date' || type.startsWith('datetime')) {
				// Date types
				return searchDateTime.init.call(
					this,
					Object.assign({}, searchDateTime.defaults, config)
				);
			}
			else if (type.includes('num')) {
				// Number types
				return searchNumber.init.call(
					this,
					Object.assign({}, searchNumber.defaults, config)
				);
			}
			else {
				// Everything else
				return searchText.init.call(this, Object.assign({}, searchText.defaults, config));
			}
		};

		// If we know the type from the saved state, we can load it immediately. This is required
		// to allow the state to be applied to the table and the first draw to have a filter
		// applied (if it is needed).
		if (loadedState) {
			if (loadedState.searchInput) {
				displayEl = initType(loadedState.searchInput.type);
			}
			else if (loadedState.searchList) {
				displayEl = initType('list');
			}
		}

		if (!displayEl) {
			// Wait until we can get the data type for the column and the run the corresponding type
			displayEl = document.createElement('div');

			dt.ready(() => {
				let column = dt.column(idx);
				let display = initType(column.type());

				displayEl.replaceWith(display);
			});
		}

		return displayEl;
	}
} as IContentPlugin<ISearchConfig>;
