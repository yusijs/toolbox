/**
 * Column grouping feature for @toolbox-web/grid-vue
 *
 * Import this module to enable the `groupingColumns` prop on TbwGrid.
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
 * @packageDocumentation
 */

// Delegate to core feature registration
import '@toolbox-web/grid/features/grouping-columns';
