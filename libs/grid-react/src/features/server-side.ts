/**
 * Server-side feature for @toolbox-web/grid-react
 *
 * Import this module to enable the `serverSide` prop on DataGrid.
 *
 * @example
 * ```tsx
 * import '@toolbox-web/grid-react/features/server-side';
 *
 * <DataGrid serverSide={{ dataSource: async (params) => fetchData(params) }} />
 * ```
 *
 * @packageDocumentation
 */

// Delegate to core feature registration
import '@toolbox-web/grid/features/server-side';
