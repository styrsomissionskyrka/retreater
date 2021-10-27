/* eslint-disable no-restricted-imports */
import { ParsedUrlQuery } from 'querystring';

import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, PreviewData } from 'next';
import { SchemaLink } from '@apollo/client/link/schema';
import { ApolloClient, NormalizedCacheObject, OperationVariables, TypedDocumentNode } from '@apollo/client';

import { createContext } from 'api/context';
import { schema } from 'api/schema';

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

export type GetServerSidePropsWithClient<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
> = (
  ctx: GetServerSidePropsContext<Q, D>,
  client: ApolloClient<NormalizedCacheObject>,
) => Promise<GetServerSidePropsResult<P>>;

export function withClient<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
>(handler: GetServerSidePropsWithClient<P, Q, D>): GetServerSideProps<P, Q, D> {
  return async (ctx) => {
    let client = prepareSSRClient(createApolloClient({}), ctx);
    let result = await handler(ctx, client);

    if ('props' in result) {
      let initialState = client.cache.extract();
      let handlerProps = await result.props;
      return {
        props: {
          initialState,
          ...handlerProps,
        },
      };
    }

    return result;
  };
}

export type QueryConfig<
  Variables extends OperationVariables = OperationVariables,
  Query extends ParsedUrlQuery = Record<keyof Variables, string | string[] | undefined>,
> = [
  query: TypedDocumentNode<unknown, Variables>,
  getVariables: void | ((ctx: GetServerSidePropsContext<Query>) => Variables),
];

export function preloadQueries<
  Variables extends OperationVariables = OperationVariables,
  Query extends ParsedUrlQuery = Record<keyof Variables, string | string[] | undefined>,
>(queries: QueryConfig<Variables, Query>[]): GetServerSideProps<{}, Query> {
  return withClient<{}, Query>(async (ctx, client) => {
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
