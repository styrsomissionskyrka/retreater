import { makeSchema, fieldAuthorizePlugin, connectionPlugin } from 'nexus';
import * as path from 'path';

import * as types from './types';

export const schema = makeSchema({
  types,
  outputs: {
    typegen: path.join(process.cwd(), 'generated/nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'generated/schema.graphql'),
  },
  contextType: {
    module: path.join(process.cwd(), 'lib/api/context/index.ts'),
    export: 'Context',
  },
  plugins: [fieldAuthorizePlugin(), connectionPlugin({ disableBackwardPagination: true })],
});
