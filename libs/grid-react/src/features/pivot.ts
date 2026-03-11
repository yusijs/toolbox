/**
 * Pivot feature for @toolbox-web/grid-react
 *
 * Import this module to enable the `pivot` prop on DataGrid.
 *
 * @example
 * ```tsx
 * import '@toolbox-web/grid-react/features/pivot';
 *
 * <DataGrid pivot={{ rowFields: ['category'], valueField: 'sales' }} />
 * ```
 *
 * @packageDocumentation
 */

// Delegate to core feature registration
import '@toolbox-web/grid/features/pivot';
