/**
 * Server-side feature for @toolbox-web/grid-vue
 *
 * Import this module to enable the `serverSide` prop on TbwGrid.
 *
 * @example
 * ```vue
 * <script setup>
 * import '@toolbox-web/grid-vue/features/server-side';
 * </script>
 *
 * <template>
 *   <TbwGrid :serverSide="{
 *     dataSource: async (params) => fetchData(params),
 *   }" />
 * </template>
 * ```
 *
 * @packageDocumentation
 */

// Delegate to core feature registration
import '@toolbox-web/grid/features/server-side';
