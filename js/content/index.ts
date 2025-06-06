import colVis, { IColVis } from './colVis';
import colVisDropdown, { IColVisDropdown } from './colVisDropdown';
import dropdown, { IDropdown } from './dropdown';
import reorder, { IReorder } from './reorder';
import reorderLeft, { IReorderLeft } from './reorderLeft';
import reorderRight, { IReorderRight } from './reorderRight';
import order, { IOrder } from './order';
import orderAddAsc, { IOrderAddAsc } from './orderAddAsc';
import orderAddDesc, { IOrderAddDesc } from './orderAddDesc';
import orderAsc, { IOrderAsc } from './orderAsc';
import orderClear, { IOrderClear } from './orderClear';
import orderDesc, { IOrderDesc } from './orderDesc';
import orderRemove, { IOrderRemove } from './orderRemove';
import orderStatus, { IOrderStatus } from './orderStatus';
import search, { ISearch } from './search';
import searchClear, { ISearchClear } from './searchClear';
import searchDropdown, { ISearchDropdown } from './searchDropdown';
import searchDateTime, { ISearchDateTime } from './searchDateTime';
import searchList, { ISearchList } from './searchList';
import searchNumber, { ISearchNumber } from './searchNumber';
import searchText, { ISearchText } from './searchText';
import spacer, { ISpacer } from './spacer';
import title, { ITitle } from './title';

export type IContentConfig =
	| IColVis
	| IColVisDropdown
	| IDropdown
	| IReorder
	| IReorderLeft
	| IReorderRight
	| IOrder
	| IOrderAddAsc
	| IOrderAddDesc
	| IOrderAsc
	| IOrderClear
	| IOrderDesc
	| IOrderRemove
	| IOrderStatus
	| ISearch
	| ISearchClear
	| ISearchDropdown
	| ISearchDateTime
	| ISearchList
	| ISearchNumber
	| ISearchText
	| ISpacer
	| ITitle;

const contentTypes = {
	colVis,
	colVisDropdown,
	dropdown,
	reorder,
	reorderLeft,
	reorderRight,
	order,
	orderAddAsc,
	orderAddDesc,
	orderAsc,
	orderClear,
	orderDesc,
	orderRemove,
	orderStatus,
	search,
	searchClear,
	searchDropdown,
	searchDateTime,
	searchList,
	searchNumber,
	searchText,
	spacer,
	title
};

export default contentTypes;
