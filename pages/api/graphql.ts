import { ApolloServer } from 'apollo-server-micro';

import { schema } from 'api/schema';
import { createContext } from 'api/context';

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
