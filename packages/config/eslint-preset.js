module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    'no-duplicate-imports': 'error',
    'jsx-a11y/anchor-is-valid': ['error', { components: ['Link'] }],
  },
};
