import { IContentPlugin } from './content';
import { ISearchListConfig } from './searchList';

export interface ISearchDropdownConfig extends ISearchListConfig {
	/** Button config */
	text: string;
}

export interface ISearchDropdown extends Partial<ISearchDropdownConfig> {
	extend: 'searchDropdown';
}

export default {
	defaults: {
		ajaxOnly: true,
		allowSearchList: true,
		className: 'searchDropdown',
		clear: true,
		columns: '',
		hidable: true,
		options: null,
		orthogonal: 'display'
,		placeholder: '',
		search: true,
		select: true,
		text: 'Search',
		title: '',
		titleAttr: ''
	},

	extend(config) {
		let dt = this.dt();

		return {
			extend: 'dropdown',
			icon: 'search',
			iconActive: 'searchActive',
			text: dt.i18n('columnControl.searchDropdown', config.text),
			content: [
				Object.assign(config, {
					extend: 'search'
				})
			]
		};
	}
} as IContentPlugin<ISearchDropdownConfig>;
