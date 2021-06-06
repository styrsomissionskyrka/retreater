module.exports = {
  client: {
    includes: ['./pages/*.ts*', './lib/*.ts*'],
    excludes: ['**/node_modules', '**/__tests__', './api/**/*', './lib/graphql/generated.ts'],
    service: {
      name: 'retreater',
      localSchemaFile: './schema.json',
    },
  },
};
