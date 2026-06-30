/**
 * Conventional Commits configuration for Lumina UI.
 * Drives the changelog and semantic versioning via `nx release`.
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      1,
      'always',
      [
        'tokens',
        'theme',
        'ui',
        'icons',
        'utilities',
        'ai',
        'testing',
        'playground',
        'docs',
        'repo',
      ],
    ],
    'body-max-line-length': [0, 'always'],
  },
};
