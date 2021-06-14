import * as path from 'path';

import { AuthenticationError } from 'apollo-server-errors';
import { makeSchema, fieldAuthorizePlugin, connectionPlugin } from 'nexus';

import * as types from './types';

export const schema = makeSchema({
  types,
  outputs: {
    typegen: path.join(process.cwd(), 'generated/nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'generated/schema.graphql'),
  },
  contextType: {
    module: path.join(process.cwd(), 'api/context/index.ts'),
    export: 'Context',
  },
  plugins: [
    connectionPlugin(),
    fieldAuthorizePlugin({
      formatError(authConfig) {
        return new AuthenticationError(authConfig.error.message);
      },
    }),
  ],
});
