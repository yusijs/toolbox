/**
 * Row grouping feature for @toolbox-web/grid-vue
 *
 * Import this module to enable the `groupingRows` prop on TbwGrid.
 *
 * @example
 * ```vue
 * <script setup>
 * import '@toolbox-web/grid-vue/features/grouping-rows';
 * </script>
 *
 * <template>
 *   <TbwGrid :groupingRows="{
 *     groupBy: ['department', 'team'],
 *     defaultExpanded: true,
 *   }" />
 * </template>
 * ```
 *
 * @packageDocumentation
 */

// Delegate to core feature registration
import '@toolbox-web/grid/features/grouping-rows';
