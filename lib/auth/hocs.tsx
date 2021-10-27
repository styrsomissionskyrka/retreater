import { ParsedUrlQuery } from 'querystring';

import { useEffect } from 'react';
import { GetServerSideProps, NextPage, PreviewData } from 'next';
import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';
import { Session } from 'next-auth';

export function authenticatedPage<P = {}, IP = P>(Page: NextPage<P, IP>): NextPage<P, IP> {
  const AuthenticatedPage: NextPage<P, IP> = (props) => {
    const router = useRouter();
    const session = useSession();

    useEffect(() => {
      if (session.status === 'loading') return;
      if (session.status === 'authenticated') return;

      router.replace({
        ...router,
        pathname: '/admin/login',
        query: { returnTo: router.asPath },
      });
    });

    if (session.status === 'loading') return <p>Laddar</p>;
    if (session.status === 'authenticated') return <Page {...props} />;

    return null;
  };

  AuthenticatedPage.displayName = `authenticated(${Page.displayName ?? Page.name ?? 'Page'})`;
  return AuthenticatedPage;
}

type WithUser<P extends { [key: string]: any } = { [key: string]: any }> = P & { session: Session };

export function authenticatedSSP<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
>(handler?: GetServerSideProps<P, Q, D>): GetServerSideProps<WithUser<P>, Q, D> {
  let handl: GetServerSideProps<WithUser<P>, Q, D> = async (ctx) => {
    const session = await getSession(ctx);

    let redirect = {
      destination: `/admin/login?${new URLSearchParams({ returnTo: ctx.resolvedUrl })}`,
      permanent: false,
    };

    if (session == null) {
      return { redirect };
    }

    if (handler == null) {
      let props = { session } as WithUser<P>;
      return { props };
    }

    let handlerResult = await handler(ctx);

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
  };

  return handl;
}
