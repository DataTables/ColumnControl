import SearchInput from '../SearchInput';
import { IContentConfig, IContentPlugin } from './content';

export interface ISearchTextConfig extends IContentConfig {
	/** Allow the input clear icon to show, or not */
	clear: boolean;

	/** List of search operator which will not be used */
	excludeLogic: Array<string>;

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

export interface ISearchText extends Partial<ISearchTextConfig> {
	extend: 'searchText';
}

export default {
	defaults: {
		clear: true,
		excludeLogic: [],
		placeholder: '',
		title: '',
		titleAttr: ''
	},

	init(config) {
		let dt = this.dt();
		let i18nBase = 'columnControl.search.text.';
		let searchInput = new SearchInput(dt, this.idx(), this.idxOriginal())
			.addClass('dtcc-searchText')
			.clearable(config.clear)
			.placeholder(config.placeholder)
			.title(config.title)
			.titleAttr(config.titleAttr)
			.options(
				[
					{label: dt.i18n(i18nBase + 'contains', 'Contains'), value: 'contains'},
					{
						label: dt.i18n(i18nBase + 'notContains', 'Does not contain'),
						value: 'notContains'
					},
					{label: dt.i18n(i18nBase + 'equal', 'Equals'), value: 'equal'},
					{label: dt.i18n(i18nBase + 'notEqual', 'Does not equal'), value: 'notEqual'},
					{label: dt.i18n(i18nBase + 'starts', 'Starts'), value: 'starts'},
					{label: dt.i18n(i18nBase + 'ends', 'Ends'), value: 'ends'},
					{label: dt.i18n(i18nBase + 'empty', 'Empty'), value: 'empty'},
					{label: dt.i18n(i18nBase + 'notEmpty', 'Not empty'), value: 'notEmpty'}
				].filter((x) => !config.excludeLogic.includes(x.value))
			)
			.search((searchType, searchTerm, loadingState) => {
				// If in a dropdown, set the parent levels as active
				if (config._parents) {
					config._parents.forEach((btn) =>
						btn.activeList(
							this.unique() + 'text',
							searchType === 'empty' || searchType === 'notEmpty' || !!searchTerm
						)
					);
				}

				let column = dt.column(this.idx());

				// When SSP, don't apply a filter here, SearchInput will add to the submit data
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

				searchTerm = searchTerm.toLowerCase();

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
					// Use a function for exact matching
					column.search.fixed('dtcc', (haystack) => haystack.toLowerCase() == searchTerm);
				}
				else if (searchType === 'notEqual') {
					column.search.fixed('dtcc', (haystack) => haystack.toLowerCase() != searchTerm);
				}
				else if (searchType === 'contains') {
					// Use the built in smart search
					column.search.fixed('dtcc', searchTerm);
				}
				else if (searchType === 'notContains') {
					// Use the built in smart search
					column.search.fixed(
						'dtcc',
						(haystack) => !haystack.toLowerCase().includes(searchTerm)
					);
				}
				else if (searchType === 'starts') {
					// Use a function for startsWith case insensitive search
					column.search.fixed('dtcc', (haystack) =>
						haystack.toLowerCase().startsWith(searchTerm)
					);
				}
				else if (searchType === 'ends') {
					column.search.fixed('dtcc', (haystack) =>
						haystack.toLowerCase().endsWith(searchTerm)
					);
				}

				// If in a dropdown, set the parent levels as active
				if (config._parents) {
					config._parents.forEach((btn) =>
						btn.activeList(this.unique() + 'text', !!column.search.fixed('dtcc'))
					);
				}

				if (!loadingState) {
					column.draw();
				}
			});

		return searchInput.element();
	}
} as IContentPlugin<ISearchTextConfig>;
