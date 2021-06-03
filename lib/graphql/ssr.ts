import { GetServerSidePropsContext } from 'next';
import { SchemaLink } from '@apollo/client/link/schema';
import { createContext } from 'api/context';
import { schema } from 'api/schema';
import { ApolloClient } from '@apollo/client';

export function prepareSSRClient<C extends ApolloClient<any>>(
  client: C,
  ctx: Pick<GetServerSidePropsContext, 'req' | 'res'>,
) {
  client.setLink(createSchemaLink(ctx));
  return client;
}

export function createSchemaLink(ctx: Pick<GetServerSidePropsContext, 'req' | 'res'>) {
  const context = createContext(ctx);
  const link = new SchemaLink({ schema, context });
  return link;
}
