/**
 * Row Grouping feature for @toolbox-web/grid-react
 *
 * Import this module to enable the `groupingRows` prop on DataGrid.
 *
 * @example
 * ```tsx
 * import '@toolbox-web/grid-react/features/grouping-rows';
 *
 * <DataGrid groupingRows={{ groupBy: ['department'] }} />
 * ```
 *
 * @packageDocumentation
 */

// Delegate to core feature registration
import '@toolbox-web/grid/features/grouping-rows';
