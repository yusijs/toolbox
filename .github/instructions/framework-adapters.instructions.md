---
applyTo: '{libs/grid-angular,libs/grid-react,libs/grid-vue}/**'
---

# Framework Adapters (Angular, React, Vue)

Each adapter auto-registers a framework-specific `GridAdapter` on `<tbw-grid>` elements. See the `new-adapter-feature` skill for full API details, usage examples, and key files for each adapter.

- **Angular** (`@toolbox-web/grid-angular`) — Directives: `Grid`, `TbwRenderer`, `TbwEditor`; Base classes: `BaseGridEditor`, `BaseGridEditorCVA`, `BaseOverlayEditor`, `BaseFilterPanel`
- **React** (`@toolbox-web/grid-react`) — Components: `DataGrid`, `GridColumn`; Hooks: `useGrid`, `useGridEvent`
- **Vue** (`@toolbox-web/grid-vue`) — Components: `DataGrid`, `GridColumn`; Composables: `useGrid`, `useGridEvent`

## Key Files

- `libs/grid-angular/src/index.ts` - Angular adapter exports (Grid, TbwRenderer, TbwEditor directives, base classes)
- `libs/grid-angular/features/*/src/index.ts` - Per-plugin inject functions (injectGridSelection, injectGridFiltering, etc.)
- `libs/grid-angular/src/lib/base-overlay-editor.ts` - BaseOverlayEditor (floating overlay panel for custom editors)
- `libs/grid-angular/src/lib/base-grid-editor-cva.ts` - BaseGridEditorCVA (dual grid/form ControlValueAccessor)
- `libs/grid-angular/src/lib/base-filter-panel.ts` - BaseFilterPanel (custom filter panel base class)
- `libs/grid-react/src/index.ts` - React adapter exports (DataGrid, GridColumn, hooks)
- `libs/grid-react/src/features/*.ts` - Per-plugin hooks (useGridSelection, useGridFiltering, etc.)
- `libs/grid-vue/src/index.ts` - Vue adapter exports (DataGrid, GridColumn, composables)
- `libs/grid-vue/src/features/*.ts` - Per-plugin composables (useGridSelection, useGridFiltering, etc.)

## TypeDoc Generation

Adapter API docs are auto-generated via `bun nx typedoc grid-{angular,react,vue}`. Feature subpath entry points (e.g., `features/selection`) are included alongside the main `index.ts` entry point. When adding a new feature:

- Add it to `entryPoints` in the adapter's `typedoc.json`
- The `typedoc-mdx-shared.ts` flattens multi-module output automatically
- Angular inject functions are categorized as "Inject Functions"; React hooks go to "Hooks"; Vue composables go to "Composables"

## Common Pitfalls

- **Keep adapter proxy signatures in sync with core plugins** — When a core plugin method gains a new parameter (e.g., `options?: { silent?: boolean }`), update the `FilteringMethods`/`*Methods` interface AND the proxy closures in **all three** adapters. Forgetting one adapter silently drops the parameter for that framework's users.
- **New feature entry points must be added to TypeDoc** — Feature functions live in subpath entry points, not the main `index.ts`. If you add a new feature (e.g., `injectGridSorting`), add its file to `typedoc.json` `entryPoints` in all three adapters or it won't appear in the generated API docs.
