import { Api } from '../../../../types/types';
import SearchInput from '../SearchInput';
import { IContentPlugin, IContentConfig } from './content';

declare var DataTable: any;

export interface ISearchDateTimeConfig extends IContentConfig {
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

export interface ISearchDateTime extends Partial<ISearchDateTimeConfig> {
	extend: 'searchDateTime';
}

export default {
	defaults: {
		clear: true,
		placeholder: '',
		title: '',
		titleAttr: ''
	},

	init(config) {
		let fromPicker = false;
		let moment = DataTable.use('moment');
		let luxon = DataTable.use('luxon');
		let dt = this.dt();
		let i18nBase = 'columnControl.search.datetime.';
		let displayFormat = '';
		let dateTime;
		let searchInput = new SearchInput(dt, this.idx())
			.type('date')
			.addClass('dtcc-searchDateTime')
			.clearable(config.clear)
			.placeholder(config.placeholder)
			.title(config.title)
			.titleAttr(config.titleAttr)
			.options([
				{ label: dt.i18n(i18nBase + 'equal', 'Equals'), value: 'equal' },
				{ label: dt.i18n(i18nBase + 'notEqual', 'Does not equal'), value: 'notEqual' },
				{ label: dt.i18n(i18nBase + 'greater', 'After'), value: 'greater' },
				{ label: dt.i18n(i18nBase + 'less', 'Before'), value: 'less' },
				{ label: dt.i18n(i18nBase + 'empty', 'Empty'), value: 'empty' },
				{ label: dt.i18n(i18nBase + 'notEmpty', 'Not empty'), value: 'notEmpty' }
			])
			.search((searchType, searchTerm, loadingState) => {
				let column = dt.column(this.idx());
				let search =
					searchTerm === ''
						? ''
						: dateToNum(
								dateTime && fromPicker ? dateTime.val() : searchTerm.trim(),
								displayFormat,
								moment,
								luxon
						  );

				if (searchType === 'empty') {
					column.search.fixed('dtcc', (haystack) => !haystack);
				}
				else if (searchType === 'notEmpty') {
					column.search.fixed('dtcc', (haystack) => !!haystack);
				}
				else if (column.search.fixed('dtcc') === '' && search === '') {
					// No change - don't do anything
					return;
				}
				else if (!search) {
					// Clear search
					column.search.fixed('dtcc', '');
				}
				else if (searchType === 'equal') {
					// Use a function for matching - weak typing
					// Note that the haystack in the search function is the rendered date - it
					// might need to be converted back to a date
					column.search.fixed(
						'dtcc',
						(haystack) => dateToNum(haystack, displayFormat, moment, luxon) == search
					);
				}
				else if (searchType === 'notEqual') {
					column.search.fixed(
						'dtcc',
						(haystack) => dateToNum(haystack, displayFormat, moment, luxon) != search
					);
				}
				else if (searchType === 'greater') {
					column.search.fixed(
						'dtcc',
						(haystack) => dateToNum(haystack, displayFormat, moment, luxon) > search
					);
				}
				else if (searchType === 'less') {
					column.search.fixed(
						'dtcc',
						(haystack) => dateToNum(haystack, displayFormat, moment, luxon) < search
					);
				}

				// If in a dropdown, set the parent levels as active
				if (config._parents) {
					config._parents.forEach((btn) =>
						btn.activeList(this.unique(), !!column.search.fixed('dtcc'))
					);
				}

				if (!loadingState) {
					column.draw();
				}
			});

		// Once data has been loaded we can run DateTime with the specified format
		dt.ready(() => {
			let DateTime = DataTable.use('datetime');

			displayFormat = getFormat(dt, this.idx());

			if (DateTime) {
				dateTime = new DateTime(searchInput.input(), {
					format: displayFormat,
					i18n: dt.settings()[0].oLanguage.datetime, // could be undefined
					onChange: () => {
						fromPicker = true;
						searchInput.runSearch();
						fromPicker = false;
					}
				});
			}
		});

		return searchInput.element();
	}
} as IContentPlugin<ISearchDateTimeConfig>;

/**
 * Determine the formatting string for the date time information in the colum
 *
 * @param dt DataTable instance
 * @param column Column index
 * @returns Date / time formatting string
 */
function getFormat(dt: Api, column: number) {
	let type = dt.column(column).type();

	if (!type) {
		// Assume that it is ISO unless otherwise specified - that is all DataTables can do anyway
		return 'YYYY-MM-DD';
	}
	else if (type === 'datetime') {
		// If no format was specified in the DT type, then we need to use Moment / Luxon's default
		// locale formatting.
		let moment = DataTable.use('moment');
		let luxon = DataTable.use('luxon');

		if (moment) {
			return moment().creationData().locale._longDateFormat.L;
		}

		if (luxon) {
			// Luxon doesn't appear to provide a way to let us get the default locale formatting
			// string, so we need to attempt to decode it.
			return luxon.DateTime.fromISO('1999-08-07')
				.toLocaleString()
				.replace('07', 'dd')
				.replace('7', 'd')
				.replace('08', 'MM')
				.replace('8', 'M')
				.replace('1999', 'yyyy')
				.replace('99', 'yy');
		}
	}
	else if (type.includes('datetime-')) {
		// Column was specified with a particular display format - we can extract that format from
		// the type, as it is part of the type name.
		return type.replace(/datetime-/g, '');
	}
	else if (type.includes('moment')) {
		return type.replace(/moment-/g, '');
	}
	else if (type.includes('luxon')) {
		return type.replace(/luxon-/g, '');
	}

	return 'YYYY-MM-DD';
}

/**
 * Convert from a source date / time value (usually a string) to a timestamp for comparisons.
 *
 * @param input Input value
 * @param srcFormat String format of the input
 * @param moment Moment instance, if it is available
 * @param luxon Luxon object, if it is available
 * @returns Time stamp - milliseconds
 */
function dateToNum(input: Date | string, srcFormat: string, moment?: any, luxon?: any) {
	if (input === '') {
		return '';
	}
	else if (input instanceof Date) {
		return input.getTime();
	}
	else if (srcFormat !== 'YYYY-MM-DD' && (moment || luxon)) {
		return moment
			? moment(input, srcFormat).unix() * 1000
			: luxon.DateTime.fromFormat(input, srcFormat).toMillis();
	}

	// new Date() with `/` separators will treat the input as local time, but with `-` it will
	// treat it as UTC. We want UTC so do a replacement
	input = input.replace(/\//g, '-');

	return new Date(input).getTime();
}
