module.exports = {
  extends: ['next', 'prettier'],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'no-duplicate-imports': 'error',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
      },
    ],

    'jsx-a11y/anchor-is-valid': ['error', { components: ['Link'] }],
  },
};
