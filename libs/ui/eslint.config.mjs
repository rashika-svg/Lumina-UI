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
    rules: {
      // This library builds the primitive ARIA widgets themselves (dialog
      // backdrop, tablist, focus-trapped containers). Their keyboard handling
      // lives on focusable children or via Escape, so these consumer-oriented
      // template rules produce false positives here. They remain enabled for
      // application code (e.g. the playground).
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
    },
  },
];
