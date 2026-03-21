/**
 * Grouping Rows Plugin Entry Point
 * Re-exports plugin class and types for tree-shakeable imports.
 *
 * @module Plugins/Grouping Rows
 */
export { GroupingRowsPlugin } from './GroupingRowsPlugin';
export type { GroupState } from './GroupingRowsPlugin';
export type {
  AggregatorMap,
  DataRowModelItem,
  DefaultExpandedValue,
  GroupRowModelItem,
  GroupRowRenderParams,
  GroupToggleDetail,
  GroupingRowsConfig,
  RenderRow,
} from './types';
