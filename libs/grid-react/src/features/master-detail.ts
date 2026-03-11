/**
 * Master-Detail feature for @toolbox-web/grid-react
 *
 * Import this module to enable the `masterDetail` prop on DataGrid.
 *
 * @example
 * ```tsx
 * import '@toolbox-web/grid-react/features/master-detail';
 *
 * <DataGrid masterDetail={{ showExpandColumn: true }}>
 *   <GridDetailPanel>{({ row }) => <DetailView row={row} />}</GridDetailPanel>
 * </DataGrid>
 * ```
 *
 * @packageDocumentation
 */

// Delegate to core feature registration
import '@toolbox-web/grid/features/master-detail';
