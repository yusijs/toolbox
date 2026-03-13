/**
 * Column Grouping feature for @toolbox-web/grid-react
 *
 * Import this module to enable the `groupingColumns` prop on DataGrid.
 * Automatically bridges React JSX `groupHeaderRenderer` to vanilla DOM.
 *
 * @example
 * ```tsx
 * import '@toolbox-web/grid-react/features/grouping-columns';
 *
 * <DataGrid groupingColumns />
 * ```
 *
 * @example Custom group header renderer
 * ```tsx
 * <DataGrid groupingColumns={{
 *   columnGroups: [...],
 *   groupHeaderRenderer: (params) => <strong>{params.label} ({params.columns.length})</strong>,
 * }} />
 * ```
 *
 * @packageDocumentation
 */

import {
  GroupingColumnsPlugin,
  type GroupHeaderRenderParams,
  type GroupingColumnsConfig,
} from '@toolbox-web/grid/plugins/grouping-columns';
import type { ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { registerFeature } from '../lib/feature-registry';

registerFeature('groupingColumns', (rawConfig) => {
  if (typeof rawConfig === 'boolean') return new GroupingColumnsPlugin();
  if (!rawConfig) return new GroupingColumnsPlugin();

  const config = rawConfig as GroupingColumnsConfig & { groupHeaderRenderer?: unknown };
  const options = { ...config } as GroupingColumnsConfig;

  // Bridge React groupHeaderRenderer (returns ReactNode) to vanilla (returns HTMLElement | string | void)
  if (typeof config.groupHeaderRenderer === 'function') {
    const reactFn = config.groupHeaderRenderer as unknown as (params: GroupHeaderRenderParams) => ReactNode;
    options.groupHeaderRenderer = (params: GroupHeaderRenderParams) => {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'contents';
      const root = createRoot(wrapper);
      flushSync(() => {
        root.render(reactFn(params) as React.ReactElement);
      });
      return wrapper;
    };
  }

  return new GroupingColumnsPlugin(options);
});
