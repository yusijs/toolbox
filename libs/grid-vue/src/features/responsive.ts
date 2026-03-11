/**
 * Responsive feature for @toolbox-web/grid-vue
 *
 * Import this module to enable the `responsive` prop on TbwGrid.
 *
 * @example
 * ```vue
 * <script setup>
 * import '@toolbox-web/grid-vue/features/responsive';
 * import { h } from 'vue';
 * </script>
 *
 * <template>
 *   <TbwGrid :responsive="{
 *     breakpoint: 768,
 *     cardRenderer: (row) => h(EmployeeCard, { employee: row }),
 *   }" />
 * </template>
 * ```
 *
 * @packageDocumentation
 */

// Delegate to core feature registration
import '@toolbox-web/grid/features/responsive';
