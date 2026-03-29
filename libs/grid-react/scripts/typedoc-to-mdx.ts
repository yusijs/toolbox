/**
 * Generate MDX files from TypeDoc JSON for grid-react.
 * Run: `bun nx typedoc grid-react`
 */

import { join } from 'node:path';

import { generateAdapterDocs, getCategory, KIND, type TypeDocNode } from '../../../tools/typedoc-mdx-shared';

const FEATURE_FUNCTIONS = new Set([
  'useGridSelection',
  'useGridFiltering',
  'useGridExport',
  'useGridPrint',
  'useGridUndoRedo',
]);

generateAdapterDocs({
  name: 'grid-react',
  urlBase: '/grid/react/api',
  jsonPath: join(import.meta.dirname, '../docs/api-generated/api.json'),
  outputDir: join(import.meta.dirname, '../../../apps/docs/src/content/docs/grid/react/api'),
  regenerateCommand: 'bun nx typedoc grid-react',
  coreJsonPath: join(import.meta.dirname, '../../grid/docs/api-generated/api.json'),
  categories: [
    {
      name: 'Components',
      folder: 'components',
      match: (n: TypeDocNode) => getCategory(n) === 'Component',
    },
    {
      name: 'Features',
      folder: 'features',
      match: (n: TypeDocNode) =>
        FEATURE_FUNCTIONS.has(n.name) || (n.name.endsWith('Methods') && n.kind === KIND.Interface),
    },
    {
      name: 'Hooks',
      folder: 'hooks',
      match: (n: TypeDocNode) => n.name.startsWith('use') && n.kind === KIND.Function,
    },
    {
      name: 'Adapters',
      folder: 'adapters',
      match: (n: TypeDocNode) => n.kind === KIND.Class && n.name.includes('Adapter'),
    },
    {
      name: 'Types',
      folder: 'types',
      match: (n: TypeDocNode) => n.kind === KIND.TypeAlias || n.kind === KIND.Interface,
    },
  ],
});
