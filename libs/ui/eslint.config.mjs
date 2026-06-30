import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  ...baseConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'lui',
          style: 'camelCase',
        },
      ],
      // Components may be element selectors (lui-avatar) or attribute selectors
      // on native hosts (button[luiButton]) to preserve built-in semantics.
      // Both must carry the `lui` prefix.
      '@angular-eslint/component-selector': [
        'error',
        [
          { type: 'element', prefix: 'lui', style: 'kebab-case' },
          { type: 'attribute', prefix: 'lui', style: 'camelCase' },
        ],
      ],
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {},
  },
];
