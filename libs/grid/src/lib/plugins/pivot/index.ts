/**
 * Pivot Plugin Entry Point
 * Re-exports plugin class and types for tree-shakeable imports.
 *
 * @module Plugins/Pivot
 */
export type { PivotDataRow } from './pivot-engine';
export { PivotPlugin } from './PivotPlugin';
export type { AggFunc, PivotConfig, PivotResult, PivotRow, PivotValueField } from './types';
