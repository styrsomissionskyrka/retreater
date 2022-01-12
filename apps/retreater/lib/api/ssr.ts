import { ParsedUrlQuery } from 'querystring';

import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
  PreviewData,
} from 'next';
import { dehydrate, DehydratedState, QueryClient } from 'react-query';

type WithDehydratedState<P extends { [key: string]: any }> = P & {
  dehydratedState: DehydratedState;
};

type WithQueryClient<
  P extends GetServerSidePropsContext | GetStaticPropsContext,
> = P & {
  queryClient: QueryClient;
};

type GetServerSidePropsHandler<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
> = (
  context: WithQueryClient<GetServerSidePropsContext<Q, D>>,
) => Promise<GetServerSidePropsResult<P>>;

type GetStaticPropsHandler<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
> = (
  context: WithQueryClient<GetStaticPropsContext<Q, D>>,
) => Promise<GetStaticPropsResult<P>>;

export function getServerSidePropsWithClient<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
>(handler: GetServerSidePropsHandler<P, Q, D>) {
  return queryClientSSRHandler(handler);
}

export function getStaticPropsWithClient<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
>(handler: GetStaticPropsHandler<P, Q, D>) {
  return queryClientSSRHandler(handler);
}

function queryClientSSRHandler<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
>(
  handler: GetServerSidePropsHandler<P, Q, D>,
): GetServerSideProps<WithDehydratedState<P>, Q, D>;
function queryClientSSRHandler<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
>(
  handler: GetStaticPropsHandler<P, Q, D>,
): GetStaticProps<WithDehydratedState<P>, Q, D>;
function queryClientSSRHandler<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
>(
  handler: GetServerSidePropsHandler<P, Q, D> | GetStaticPropsHandler<P, Q, D>,
):
  | GetServerSideProps<WithDehydratedState<P>, Q, D>
  | GetStaticProps<WithDehydratedState<P>, Q, D> {
  return async (
    context: GetServerSidePropsContext<Q, D> | GetStaticPropsContext<Q, D>,
  ) => {
    let queryClient = new QueryClient();

    let result = await handler({ ...(context as unknown as any), queryClient });

    if ('props' in result) {
      let props = await result.props;
      return {
        props: {
          ...props,
          dehydratedState: dehydrate(queryClient),
        },
      };
    }

    return result;
  };
}
