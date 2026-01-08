// Type definitions for DataTables ColumnControl
//
// Project: https://datatables.net/extensions/columncontrol/, https://datatables.net
// Definitions by:
//   SpryMedia
//   Andy Ma <https://github.com/andy-maca>

/// <reference types="jquery" />

import DataTables from 'datatables.net';
import { TContentItem } from '../dist/ColumnControl';

export default DataTables;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables' types integration
 */
declare module 'datatables.net' {
	interface Config {
		/**
		 * Common ColumnControl extension options to apply to all columns
		 */
		columnControl?: ConfigColumnControl | Array<TContentItem | ConfigColumnControl>;
	}

	interface ConfigColumns {
		/**
		 * Column specific column configuration options
		 *
		 * @returns Api for chaining with the additional ColumnControl methods
		 */
		columnControl?: ConfigColumnControl | Array<TContentItem | ConfigColumnControl>;
	}

	interface DataTablesStatic {
		/**
		 * ColumnControl class
		 */
		ColumnControl: {
			/**
			 * Create a new ColumnControl instance for a specific column
			 */
			new (
				dt: Api<any>,
				columnIdx: number,
				config: ConfigColumnControl
			): DataTablesStatic['ColumnControl'];

			/**
			 * ColumnControl version
			 */
			version: string;

			/**
			 * Default configuration values
			 */
			defaults: ConfigColumnControl;
		};
	}

	interface ConfigLanguage {
		/** Column Control language options */
		columnControl: {
			/** Column visibility title */
			colVis?: string;

			/** Column visibility button text */
			colVisDropdown?: string;

			/** Dropdown button text */
			dropdown?: string;

			/** Add to ordering (ascending) button text */
			orderAddAsc?: string;

			/** Add to ordering (descending) button text */
			orderAddDesc?: string;

			/** Set ordering (ascending) button text */
			orderAsc?: string;

			/** Clear all ordering button text */
			orderClear?: string;

			/** Set ordering (descending) button text */
			orderDesc?: string;

			/** Remove column from multi-ordering button text */
			orderRemove?: string;

			/** Column reorder button text */
			reorder?: string;

			/** Move column left button text */
			reorderLeft?: string;

			/** Move column right button text */
			reorderRight?: string;

			/** Clear search button text */
			searchClear?: string;

			/** Search dropdown button text */
			searchDropdown?: string;

			/** Search list dropdown button text */
			searchList?: string;

			/** Spacer text */
			spacer?: string;

			/** List strings, used for searchList and colVis */
			list?: {
				/** Select all link text */
				add?: string;

				/** Label for when there is no label */
				empty?: string;

				/** Select none link text */
				none?: string;

				/** Search placeholder */
				search?: string;
			};

			/** Strings used for the <select> available for choosing different search logic */
			search?: {
				/** searchText options */
				text?: {
					equal?: string;
					notEqual?: string;
					starts?: string;
					ends?: string;
					empty?: string;
					notEmpty?: string;
				};

				/** searchDateTime options */
				datetime?: {
					equal?: string;
					notEqual?: string;
					greater?: string;
					less?: string;
					empty?: string;
					notEmpty?: string;
				};

				/** searchNumber options */
				number?: {
					equal?: string;
					notEqual?: string;
					greater?: string;
					greaterOrEqual?: string;
					less?: string;
					lessOrEqual?: string;
					empty?: string;
					notEmpty?: string;
				};
			};
		};
	}

	interface ApiColumnMethods<T> {
		/** Methods for ColumnControl */
		columnControl: {
			/**
			 * Clear any ColumnControl search that is applied to the selected column (both
			 * `searchList` and the input search types will be cleared).
			 */
			searchClear(): ApiColumnMethods<T>;

			/**
			 * Reload the options for the `searchList` content type, or provide new options.
			 *
			 * @param options Options to load in, or use `'refresh'` to read from the table.
			 */
			searchList(
				options: 'refresh' | string[] | Array<{ label: string; value: any }>
			): ApiColumnMethods<T>;
		};
	}

	interface ApiColumnsMethods<T> {
		columnControl: {
			/**
			 * Clear any ColumnControl search that is applied to the selected columns (both
			 * `searchList` and the input search types will be cleared).
			 */
			searchClear(): ApiColumnMethods<T>;

			/**
			 * Reload the options for the `searchList` content type, or provide new options.
			 *
			 * @param options Options to load in, or use `'refresh'` to read from the table.
			 */
			searchList(
				options: 'refresh' | string[] | Array<{ label: string; value: any }>
			): ApiColumnMethods<T>;
		};
	}
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Options
 */
type TTfootTarget = `tfoot:${number}`;
type TTheadTarget = `thead:${number}`;

interface ConfigColumnControl {
	/**
	/**
	 * Designate the target header or footer row for where to insert the ColumnControl's content
	 */
	target: number | 'tfoot' | TTfootTarget | TTheadTarget;

	/**
	 * Class(es) to assign to the target row.
	 */
	className?: string | string[];

	/**
	 * Content to show in the cells.
	 */
	content?: TContentItem[];
}
