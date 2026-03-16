/**
 * Grouping Columns Plugin Entry Point
 * Re-exports plugin class and types for tree-shakeable imports.
 *
 * @module Plugins/Grouping Columns
 */
export { resolveColumnGroupDefs, slugifyHeader } from './grouping-columns';
export { GroupingColumnsPlugin } from './GroupingColumnsPlugin';
export type { ColumnGroup, ColumnGroupDefinition, GroupHeaderRenderParams, GroupingColumnsConfig } from './types';
