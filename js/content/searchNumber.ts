import SearchInput from '../SearchInput';
import { IContentConfig, IContentPlugin } from './content';

export interface ISearchNumberConfig extends IContentConfig {
	/** Allow the input clear icon to show, or not */
	clear: boolean;

	/** Placeholder text to apply to the `input` */
	placeholder: string;

	/** Title text to show above the search input. `[title]` will be replaced by the column title */
	title: string;

	/**
	 * Text to apply to a `title` attribute for the search input. `[title]` will be replaced by
	 * the column title
	 */
	titleAttr: string;
}

export interface ISearchNumber extends Partial<ISearchNumberConfig> {
	extend: 'searchNumber';
}

export default {
	defaults: {
		clear: true,
		placeholder: '',
		title: '',
		titleAttr: ''
	},

	init(config) {
		let dt = this.dt();
		let i18nBase = 'columnControl.search.number.';
		let searchInput = new SearchInput(dt, this.idx())
			.type('num')
			.addClass('dtcc-searchNumber')
			.clearable(config.clear)
			.placeholder(config.placeholder)
			.title(config.title)
			.titleAttr(config.titleAttr)
			.options([
				{ label: dt.i18n(i18nBase + 'equal', 'Equals'), value: 'equal' },
				{ label: dt.i18n(i18nBase + 'notEqual', 'Does not equal'), value: 'notEqual' },
				{ label: dt.i18n(i18nBase + 'greater', 'Greater than'), value: 'greater' },
				{
					label: dt.i18n(i18nBase + 'greaterOrEqual', 'Greater or equal'),
					value: 'greaterOrEqual'
				},
				{ label: dt.i18n(i18nBase + 'less', 'Less than'), value: 'less' },
				{ label: dt.i18n(i18nBase + 'lessOrEqual', 'Less or equal'), value: 'lessOrEqual' },
				{ label: dt.i18n(i18nBase + 'empty', 'Empty'), value: 'empty' },
				{ label: dt.i18n(i18nBase + 'notEmpty', 'Not empty'), value: 'notEmpty' }
			])
			.search((searchType, searchTerm, loadingState) => {
				// If in a dropdown, set the parent levels as active
				if (config._parents) {
					config._parents.forEach((btn) =>
						btn.activeList(
							this.unique(),
							searchType === 'empty' || searchType === 'notEmpty' || !!searchTerm
						)
					);
				}

				let column = dt.column(this.idx());

				// When SSP, don't apply a filter here, SearchInput will add to
				// the submit data
				if (dt.page.info().serverSide) {
					// Need to let the searchClear button know if we have a filter
					// applied though.
					(column.init() as any).__ccList = !!(
						searchType === 'empty' ||
						searchType === 'notEmpty' ||
						searchTerm
					);

					if (!loadingState) {
						dt.draw();
					}

					return;
				}

				if (searchType === 'empty') {
					column.search.fixed('dtcc', (haystack) => !haystack);
				}
				else if (searchType === 'notEmpty') {
					column.search.fixed('dtcc', (haystack) => !!haystack);
				}
				else if (column.search.fixed('dtcc') === '' && searchTerm === '') {
					// No change - don't do anything
					return;
				}
				else if (searchTerm === '') {
					// Clear search
					column.search.fixed('dtcc', '');
				}
				else if (searchType === 'equal') {
					// Use a function for matching - weak typing
					column.search.fixed('dtcc', (haystack) => stringToNum(haystack) == searchTerm);
				}
				else if (searchType === 'notEqual') {
					column.search.fixed('dtcc', (haystack) => stringToNum(haystack) != searchTerm);
				}
				else if (searchType === 'greater') {
					column.search.fixed('dtcc', (haystack) => stringToNum(haystack) > searchTerm);
				}
				else if (searchType === 'greaterOrEqual') {
					column.search.fixed('dtcc', (haystack) => stringToNum(haystack) >= searchTerm);
				}
				else if (searchType === 'less') {
					column.search.fixed('dtcc', (haystack) => stringToNum(haystack) < searchTerm);
				}
				else if (searchType === 'lessOrEqual') {
					column.search.fixed('dtcc', (haystack) => stringToNum(haystack) <= searchTerm);
				}

				if (!loadingState) {
					column.draw();
				}
			});

		// Set a numeric input type, per BBC's guidelines
		searchInput.input().setAttribute('inputmode', 'numeric');
		searchInput.input().setAttribute('pattern', '[0-9]*');

		return searchInput.element();
	}
} as IContentPlugin<ISearchNumberConfig>;

var _re_html = /<([^>]*>)/g;
var _re_formatted_numeric = /['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;

function stringToNum(d) {
	if (d !== 0 && (!d || d === '-')) {
		return -Infinity;
	}

	var type = typeof d;

	if (type === 'number' || type === 'bigint') {
		return d;
	}

	if (d.replace) {
		d = d.replace(_re_html, '').replace(_re_formatted_numeric, '');
	}

	return d * 1;
}
