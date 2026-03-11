/**
 * Pivot feature for @toolbox-web/grid-vue
 *
 * Import this module to enable the `pivot` prop on TbwGrid.
 *
 * @example
 * ```vue
 * <script setup>
 * import '@toolbox-web/grid-vue/features/pivot';
 * </script>
 *
 * <template>
 *   <TbwGrid :pivot="{
 *     rowFields: ['category'],
 *     columnFields: ['year'],
 *     valueField: 'sales',
 *   }" />
 * </template>
 * ```
 *
 * @packageDocumentation
 */

// Delegate to core feature registration
import '@toolbox-web/grid/features/pivot';
