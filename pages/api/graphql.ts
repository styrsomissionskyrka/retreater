import { ApolloServer } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse } from 'next';

import { schema } from 'api/schema';
import { createContext } from 'api/context';

export const config = {
  api: {
    bodyParser: false,
  },
};

let server = new ApolloServer({ schema, context: createContext });
let startServer = server.start();

async function init() {
  await startServer;
  return server.createHandler({ path: '/api/graphql' });
}

let handlerPromise = init();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let handler = await handlerPromise;
  return handler(req, res);
}
