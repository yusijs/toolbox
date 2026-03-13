/**
 * Column grouping feature for @toolbox-web/grid-vue
 *
 * Import this module to enable the `groupingColumns` prop on TbwGrid.
 * Automatically bridges Vue render-function `groupHeaderRenderer` to vanilla DOM.
 *
 * @example
 * ```vue
 * <script setup>
 * import '@toolbox-web/grid-vue/features/grouping-columns';
 * </script>
 *
 * <template>
 *   <TbwGrid :groupingColumns="{
 *     columnGroups: [
 *       { header: 'Personal Info', children: ['firstName', 'lastName'] },
 *     ],
 *   }" />
 * </template>
 * ```
 *
 * @example Custom group header renderer
 * ```vue
 * <TbwGrid :groupingColumns="{
 *   columnGroups: [...],
 *   groupHeaderRenderer: (params) => h('strong', `${params.label} (${params.columns.length})`),
 * }" />
 * ```
 *
 * @packageDocumentation
 */

import {
  GroupingColumnsPlugin,
  type GroupHeaderRenderParams,
  type GroupingColumnsConfig,
} from '@toolbox-web/grid/plugins/grouping-columns';
import { createApp, type VNode } from 'vue';
import { registerFeature } from '../lib/feature-registry';

registerFeature('groupingColumns', (rawConfig) => {
  if (rawConfig === true) {
    return new GroupingColumnsPlugin();
  }
  if (!rawConfig) {
    return new GroupingColumnsPlugin();
  }

  const config = rawConfig as GroupingColumnsConfig & { groupHeaderRenderer?: unknown };
  const options = { ...config } as GroupingColumnsConfig;

  // Bridge Vue groupHeaderRenderer (returns VNode) to vanilla (returns HTMLElement | string | void)
  if (typeof config.groupHeaderRenderer === 'function') {
    const vueFn = config.groupHeaderRenderer as unknown as (params: GroupHeaderRenderParams) => VNode;
    options.groupHeaderRenderer = (params: GroupHeaderRenderParams) => {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'contents';

      const app = createApp({
        render() {
          return vueFn(params);
        },
      });

      app.mount(wrapper);
      return wrapper;
    };
  }

  return new GroupingColumnsPlugin(options);
});
