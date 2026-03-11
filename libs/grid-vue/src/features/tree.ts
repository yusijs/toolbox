/**
 * Tree view feature for @toolbox-web/grid-vue
 *
 * Import this module to enable the `tree` prop on TbwGrid.
 *
 * @example
 * ```vue
 * <script setup>
 * import '@toolbox-web/grid-vue/features/tree';
 * </script>
 *
 * <template>
 *   <TbwGrid :tree="{
 *     childrenField: 'children',
 *     defaultExpanded: true,
 *   }" />
 * </template>
 * ```
 *
 * @packageDocumentation
 */

// Delegate to core feature registration
import '@toolbox-web/grid/features/tree';
