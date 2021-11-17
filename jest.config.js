const nextJest = require('next/jest');

const createJestConfig = nextJest();
module.exports = createJestConfig({
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
});
