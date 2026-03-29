/**
 * Generate MDX files from TypeDoc JSON for grid-angular.
 * Run: `bun nx typedoc grid-angular`
 */

import { join } from 'node:path';

import { generateAdapterDocs, getCategory, KIND, type TypeDocNode } from '../../../tools/typedoc-mdx-shared';

generateAdapterDocs({
  name: 'grid-angular',
  urlBase: '/grid/angular/api',
  jsonPath: join(import.meta.dirname, '../docs/api-generated/api.json'),
  outputDir: join(import.meta.dirname, '../../../apps/docs/src/content/docs/grid/angular/api'),
  regenerateCommand: 'bun nx typedoc grid-angular',
  coreJsonPath: join(import.meta.dirname, '../../grid/docs/api-generated/api.json'),
  categories: [
    {
      name: 'Directives',
      folder: 'directives',
      match: (n: TypeDocNode) => n.kind === KIND.Class && getCategory(n) === 'Directive',
    },
    {
      name: 'Features',
      folder: 'features',
      match: (n: TypeDocNode) =>
        (n.name.startsWith('injectGrid') && n.name !== 'injectGrid' && n.kind === KIND.Function) ||
        (n.name.endsWith('Methods') && n.kind === KIND.Interface),
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
