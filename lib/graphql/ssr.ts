import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { SchemaLink } from '@apollo/client/link/schema';
import { createContext } from 'api/context';
import { schema } from 'api/schema';
import {
  ApolloClient,
  DocumentNode,
  NormalizedCacheObject,
  OperationVariables,
  TypedDocumentNode,
} from '@apollo/client';
import { ParsedUrlQuery, ParsedUrlQueryInput } from 'querystring';
import { clearCachedClient, createApolloClient } from './client';

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

type GetServerSidePropsWithClient<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
> = (
  ctx: GetServerSidePropsContext<Q>,
  client: ApolloClient<NormalizedCacheObject>,
) => Promise<GetServerSidePropsResult<P>>;

export function withClient<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
>(handler: GetServerSidePropsWithClient<P, Q>): GetServerSideProps<P, Q> {
  return async (ctx) => {
    let client = prepareSSRClient(createApolloClient({}), ctx);
    let result = await handler(ctx, client);

    if ('props' in result) {
      let initialState = client.cache.extract();
      return {
        ...result,
        props: {
          initialState,
          ...result.props,
        },
      };
    }

    return result;
  };
}

type QueryConfig<
  Variables extends OperationVariables = OperationVariables,
  Query extends ParsedUrlQuery = ParsedUrlQuery,
> = [
  query: TypedDocumentNode<unknown, Variables>,
  getVariables: void | ((ctx: GetServerSidePropsContext<Query>) => Variables),
];

export function preloadQueries<Query extends ParsedUrlQuery>(queries: QueryConfig[]): GetServerSideProps<{}, Query> {
  return withClient(async (ctx, client) => {
    try {
      await Promise.all(
        queries.map(([query, getVariables]) => {
          let variables = typeof getVariables === 'function' ? getVariables(ctx) : undefined;
          return client.query({ query, variables });
        }),
      );

      return { props: {} };
    } finally {
      clearCachedClient();
    }
  });
}
