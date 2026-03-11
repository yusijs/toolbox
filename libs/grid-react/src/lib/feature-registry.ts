/**
 * Feature Registry for @toolbox-web/grid-react
 *
 * Delegates to the core registry at `@toolbox-web/grid/features/registry`.
 * This module re-exports core functions so existing feature modules continue
 * to work without changing their import paths.
 *
 * @example
 * ```tsx
 * // Import features you need (side-effect imports)
 * import '@toolbox-web/grid-react/features/selection';
 * import '@toolbox-web/grid-react/features/filtering';
 *
 * // Props work automatically - no async loading, no HTTP requests
 * <DataGrid selection="range" filtering={{ debounceMs: 200 }} />
 * ```
 */

// Re-export core registry — all adapters share the same registry Map
export {
  clearFeatureRegistry, createPluginFromFeature, getFeatureFactory,
  getRegisteredFeatures, isFeatureRegistered, registerFeature
} from '@toolbox-web/grid/features/registry';

export type { PluginFactory } from '@toolbox-web/grid/features/registry';

// Keep backward-compatible FeatureName type based on React's FeatureProps
import type { FeatureProps } from './feature-props';
export type FeatureName = keyof FeatureProps;
