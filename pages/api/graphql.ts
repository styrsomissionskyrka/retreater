import { ApolloServer } from 'apollo-server-micro';

import { schema } from 'lib/api/schema';
import { createContext } from 'lib/api/context';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({
  schema,
  context: createContext,
}).createHandler({
  path: '/api/graphql',
});
