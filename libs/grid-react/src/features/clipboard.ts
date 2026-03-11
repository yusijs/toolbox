/**
 * Clipboard feature for @toolbox-web/grid-react
 *
 * Import this module to enable the `clipboard` prop on DataGrid.
 * Requires the selection feature to be enabled.
 *
 * @example
 * ```tsx
 * import '@toolbox-web/grid-react/features/selection';
 * import '@toolbox-web/grid-react/features/clipboard';
 *
 * <DataGrid selection="range" clipboard />
 * ```
 *
 * @packageDocumentation
 */

// Delegate to core feature registration
import '@toolbox-web/grid/features/clipboard';
