import { ParsedUrlQuery } from 'querystring';

import { GetServerSideProps, PreviewData } from 'next';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

import { withClient, GetServerSidePropsWithClient } from '../graphql/ssr';
import { ME } from '../graphql/queries';

type WithUser<P extends { [key: string]: any } = { [key: string]: any }> = P & { session: Session };

export function authenticatedSSP<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
>(handler?: GetServerSidePropsWithClient<P, Q, D>): GetServerSideProps<WithUser<P>, Q, D> {
  return withClient<WithUser<P>, Q, D>(async (ctx, client) => {
    const session = await getSession(ctx);

    let redirect = {
      destination: `/admin/login?${new URLSearchParams({ returnTo: ctx.resolvedUrl })}`,
      permanent: false,
    };

    if (session == null) {
      return { redirect };
    }

    await client.query({ query: ME });

    if (handler == null) {
      let props = { session } as WithUser<P>;
      return { props };
    }

    let handlerResult = await handler(ctx, client);

    if ('props' in handlerResult) {
      let handlerProps = await handlerResult.props;
      return {
        props: {
          ...handlerProps,
          session,
        },
      };
    }

    return handlerResult;
  });
}
