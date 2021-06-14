module.exports = {
  extends: ['react-app', 'react-app/jest', 'next', 'plugin:cypress/recommended'],
  plugins: ['cypress', 'graphql'],
  settings: {
    'import/resolver': { typescript: {} },
  },
  rules: {
    'react/prop-types': 'off',
    'react-hooks/exhaustive-deps': ['warn', { additionalHooks: '(useIsomorphicLayoutEffect)' }],

    'graphql/template-strings': ['error', { env: 'apollo', schemaJson: require('./schema.json') }],
    'graphql/named-operations': ['error', { env: 'apollo', schemaJson: require('./schema.json') }],
    'graphql/no-deprecated-fields': ['warn', { env: 'apollo', schemaJson: require('./schema.json') }],

    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
      },
    ],

    'jsx-a11y/anchor-is-valid': ['error', { components: ['Link'] }],

    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react',
            importNames: ['useLayoutEffect'],
            message:
              'Please use useIsomorphicLayoutEffect from "lib/hooks" instead. It is necessary since this application is server side rendered and useLayoutEffect does not work on SSR.',
          },
          {
            name: 'next/link',
            importNames: ['default'],
            message: 'Please use Link from "lib/components/Link" instead.',
          },
          {
            name: '@apollo/client',
            message: 'Please use the query/mutation hooks from "lib/graphql" instead.',
          },
        ],
      },
    ],
  },
};
