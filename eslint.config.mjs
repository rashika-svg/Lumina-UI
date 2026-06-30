import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      // Lumina UI layered architecture. Each library declares a `type:*` tag;
      // these constraints enforce a strict, acyclic dependency graph so the
      // foundation layers (tokens, utilities) can never depend on higher layers.
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            // Apps sit at the top and may consume any published layer.
            { sourceTag: 'type:app', onlyDependOnLibsWithTags: ['*'] },
            // AI-assisted generation needs the full component surface.
            {
              sourceTag: 'type:ai',
              onlyDependOnLibsWithTags: [
                'type:ai',
                'type:ui',
                'type:theme',
                'type:icons',
                'type:tokens',
                'type:util',
              ],
            },
            // Test utilities may reach into the layers they help test.
            {
              sourceTag: 'type:testing',
              onlyDependOnLibsWithTags: [
                'type:testing',
                'type:ui',
                'type:theme',
                'type:tokens',
                'type:util',
              ],
            },
            // Components compose icons + theme + tokens + utilities.
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: [
                'type:ui',
                'type:theme',
                'type:icons',
                'type:tokens',
                'type:util',
              ],
            },
            // The theme engine resolves tokens; nothing higher.
            {
              sourceTag: 'type:theme',
              onlyDependOnLibsWithTags: [
                'type:theme',
                'type:tokens',
                'type:util',
              ],
            },
            {
              sourceTag: 'type:icons',
              onlyDependOnLibsWithTags: ['type:icons', 'type:util'],
            },
            // Utilities are framework-agnostic leaves.
            { sourceTag: 'type:util', onlyDependOnLibsWithTags: ['type:util'] },
            // Design tokens are the absolute foundation — zero dependencies.
            {
              sourceTag: 'type:tokens',
              onlyDependOnLibsWithTags: ['type:tokens'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
