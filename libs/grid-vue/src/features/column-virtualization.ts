/**
 * Column virtualization feature for @toolbox-web/grid-vue
 *
 * Import this module to enable the `columnVirtualization` prop on TbwGrid.
 *
 * @example
 * ```vue
 * <script setup>
 * import '@toolbox-web/grid-vue/features/column-virtualization';
 * </script>
 *
 * <template>
 *   <TbwGrid columnVirtualization />
 * </template>
 * ```
 *
 * @packageDocumentation
 */

// Delegate to core feature registration
import '@toolbox-web/grid/features/column-virtualization';
