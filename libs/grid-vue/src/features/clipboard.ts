/**
 * Clipboard feature for @toolbox-web/grid-vue
 *
 * Import this module to enable the `clipboard` prop on TbwGrid.
 *
 * @example
 * ```vue
 * <script setup>
 * import '@toolbox-web/grid-vue/features/clipboard';
 * </script>
 *
 * <template>
 *   <TbwGrid selection="range" clipboard />
 * </template>
 * ```
 *
 * @packageDocumentation
 */

// Delegate to core feature registration
import '@toolbox-web/grid/features/clipboard';
