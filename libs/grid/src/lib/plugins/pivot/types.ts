import type { ExpandCollapseAnimation } from '../../core/types';
export type { ExpandCollapseAnimation } from '../../core/types';

/**
 * Built-in aggregation functions for pivot value fields.
 *
 * Each function is applied per-cell to aggregate the matching data rows into a single value:
 *
 * | Function | Result | Blank handling |
 * |----------|--------|----------------|
 * | `'sum'` | Numeric total of all values | Non-numeric values ignored |
 * | `'avg'` | Arithmetic mean | Non-numeric values excluded from count |
 * | `'count'` | Number of rows in the group | Counts all rows including blanks |
 * | `'min'` | Smallest numeric value | Non-numeric values ignored |
 * | `'max'` | Largest numeric value | Non-numeric values ignored |
 * | `'first'` | Value from the first row in the group | May be `undefined` if group is empty |
 * | `'last'` | Value from the last row in the group | May be `undefined` if group is empty |
 *
 * @example
 * ```typescript
 * const valueFields: PivotValueField[] = [
 *   { field: 'revenue', aggFunc: 'sum', header: 'Total Revenue' },
 *   { field: 'revenue', aggFunc: 'avg', header: 'Avg Revenue' },
 *   { field: 'orders',  aggFunc: 'count', header: '# Orders' },
 * ];
 * ```
 */
export type AggFunc = 'sum' | 'avg' | 'count' | 'min' | 'max' | 'first' | 'last';

/**
 * Configuration for the pivot plugin.
 *
 * Pivot mode transforms flat row data into a cross-tabulation (pivot table)
 * by grouping rows along one axis (`rowGroupFields`), spreading unique values
 * of another field across columns (`columnGroupFields`), and computing
 * aggregate values (`valueFields`) at each intersection.
 *
 * @example
 * ```typescript
 * new PivotPlugin({
 *   rowGroupFields: ['department'],
 *   columnGroupFields: ['quarter'],
 *   valueFields: [{ field: 'revenue', aggFunc: 'sum' }],
 *   showTotals: true,
 *   showGrandTotal: true,
 * })
 * ```
 */
export interface PivotConfig {
  /** Whether pivot view is active on load (default: true when fields are configured) */
  active?: boolean;
  /** Fields to group rows by (vertical axis). Multiple fields create nested groups. */
  rowGroupFields?: string[];
  /** Fields whose unique values become column headers (horizontal axis). */
  columnGroupFields?: string[];
  /** Value fields to aggregate at each row/column intersection. */
  valueFields?: PivotValueField[];
  showTotals?: boolean;
  showGrandTotal?: boolean;
  /** Whether groups are expanded by default (default: true) */
  defaultExpanded?: boolean;
  /** Indent width per depth level in pixels (default: 20) */
  indentWidth?: number;
  /** Whether to show the pivot configuration tool panel (default: true) */
  showToolPanel?: boolean;
  /**
   * Animation style for expanding/collapsing groups.
   * - `false`: No animation
   * - `'slide'`: Slide animation (default)
   * - `'fade'`: Fade animation
   * @default 'slide'
   */
  animation?: ExpandCollapseAnimation;
}

/**
 * Defines a value field in the pivot table — which data field to aggregate
 * and how to compute the aggregation.
 *
 * Multiple `PivotValueField` entries on the same `field` with different `aggFunc`
 * values create separate columns (e.g. "Revenue (Sum)" and "Revenue (Avg)").
 */
export interface PivotValueField {
  /** The row data field to aggregate (must exist on the source row objects). */
  field: string;
  /** Aggregation function to apply (see {@link AggFunc} for options). */
  aggFunc: AggFunc;
  /** Custom column header label. Defaults to `"field (aggFunc)"` if omitted. */
  header?: string;
}

export interface PivotState {
  isActive: boolean;
  pivotResult: PivotResult | null;
  expandedKeys: Set<string>;
}

/**
 * Computed result of the pivot transformation.
 *
 * Produced internally by the pivot engine after processing source rows
 * through the configured `rowGroupFields`, `columnGroupFields`, and `valueFields`.
 */
export interface PivotResult {
  /** Hierarchical pivot rows (group headers + leaf rows). */
  rows: PivotRow[];
  /** Unique column keys derived from `columnGroupFields` values. */
  columnKeys: string[];
  /** Per-column totals (keyed by column key). Present when `showTotals` is enabled. */
  totals: Record<string, number>;
  /** Grand total across all columns. Present when `showGrandTotal` is enabled. */
  grandTotal: number;
}

export interface PivotRow {
  /** Unique key for this row (hierarchical path) */
  rowKey: string;
  /** Display label for this row */
  rowLabel: string;
  /** Depth level (0 = top level) */
  depth: number;
  /** Aggregated values by column key */
  values: Record<string, number | null>;
  /** Row total across all columns */
  total?: number;
  /** Whether this row has children (is a group header) */
  isGroup: boolean;
  /** Child rows (for hierarchical grouping) */
  children?: PivotRow[];
  /** Number of data rows in this group */
  rowCount?: number;
}

// Module Augmentation - Register plugin name for type-safe getPluginByName()
declare module '../../core/types' {
  interface PluginNameMap {
    pivot: import('./PivotPlugin').PivotPlugin;
  }
}
