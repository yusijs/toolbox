/**
 * Master-detail feature for @toolbox-web/grid-vue
 *
 * Import this module to enable the `masterDetail` prop on TbwGrid.
 *
 * @example
 * ```vue
 * <script setup>
 * import '@toolbox-web/grid-vue/features/master-detail';
 * import { h } from 'vue';
 * </script>
 *
 * <template>
 *   <TbwGrid :masterDetail="{
 *     renderer: (row) => h(OrderDetails, { order: row }),
 *   }" />
 * </template>
 * ```
 *
 * @packageDocumentation
 */

// Delegate to core feature registration
import '@toolbox-web/grid/features/master-detail';
