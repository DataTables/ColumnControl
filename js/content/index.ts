import colVis, { IColVis } from './colVis';
import colVisDropdown, { IColVisDropdown } from './colVisDropdown';
import dropdown, { IDropdown } from './dropdown';
import info, { IInfo } from './info';
import order, { IOrder } from './order';
import orderAddAsc, { IOrderAddAsc } from './orderAddAsc';
import orderAddDesc, { IOrderAddDesc } from './orderAddDesc';
import orderAsc, { IOrderAsc } from './orderAsc';
import orderClear, { IOrderClear } from './orderClear';
import orderDesc, { IOrderDesc } from './orderDesc';
import orderRemove, { IOrderRemove } from './orderRemove';
import orderStatus, { IOrderStatus } from './orderStatus';
import reorder, { IReorder } from './reorder';
import reorderLeft, { IReorderLeft } from './reorderLeft';
import reorderRight, { IReorderRight } from './reorderRight';
import rowGroup, { IRowGroup } from './rowGroup';
import rowGroupAdd, { IRowGroupAdd } from './rowGroupAdd';
import rowGroupClear, { IRowGroupClear } from './rowGroupClear';
import rowGroupRemove, { IRowGroupRemove } from './rowGroupRemove';
import search, { ISearch } from './search';
import searchClear, { ISearchClear } from './searchClear';
import searchDateTime, { ISearchDateTime } from './searchDateTime';
import searchDropdown, { ISearchDropdown } from './searchDropdown';
import searchList, { ISearchList } from './searchList';
import searchNumber, { ISearchNumber } from './searchNumber';
import searchText, { ISearchText } from './searchText';
import spacer, { ISpacer } from './spacer';
import title, { ITitle } from './title';

export type IContentConfig =
	| IColVis
	| IColVisDropdown
	| IDropdown
	| IInfo
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
	| IRowGroup
	| IRowGroupAdd
	| IRowGroupClear
	| IRowGroupRemove
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
	info,
	reorder,
	reorderLeft,
	reorderRight,
	rowGroup,
	rowGroupAdd,
	rowGroupClear,
	rowGroupRemove,
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
