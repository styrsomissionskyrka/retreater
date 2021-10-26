import { ParsedUrlQuery } from 'querystring';

import { useEffect } from 'react';
import { GetServerSideProps, NextPage, PreviewData } from 'next';
import { useRouter } from 'next/router';
import { UserRole, getSession, Session } from '@auth0/nextjs-auth0';

import { useUser } from '../hooks';
import { hasIntersection } from '../utils/array';

export function authenticatedPage<P = {}, IP = P>(
  Page: NextPage<P, IP>,
  requiredRoles: UserRole[] = [],
): NextPage<P, IP> {
  const AuthenticatedPage: NextPage<P, IP> = (props) => {
    const router = useRouter();
    const { user, isLoading, error, hasRoles } = useUser();

    useEffect(() => {
      if (isLoading) return;
      if (error != null) return;
      if (user != null && hasRoles(requiredRoles)) return;

      router.replace({
        ...router,
        pathname: '/admin/login',
        query: { returnTo: router.asPath },
      });
    });

    if (isLoading) return <p>Loading</p>;
    if (error != null) return <p>An error occured</p>;
    if (user != null) return <Page {...props} />;

    return null;
  };

  AuthenticatedPage.displayName = `authenticated(${Page.displayName ?? Page.name ?? 'Page'})`;
  return AuthenticatedPage;
}

type WithUser<P extends { [key: string]: any } = { [key: string]: any }> = P & { user: Session['user'] };

export function authenticatedSSP<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
>(handler?: GetServerSideProps<P, Q, D>, requiredRoles?: UserRole[]): GetServerSideProps<WithUser<P>, Q, D> {
  return async (ctx) => {
    const session = getSession(ctx.req, ctx.res);

    let redirect = {
      destination: `/admin/login?${new URLSearchParams({ returnTo: ctx.resolvedUrl })}`,
      permanent: false,
    };

    if (session?.user == null) {
      return { redirect };
    }

    if (session?.user != null && Array.isArray(requiredRoles)) {
      let userRoles = session.user['https://styrsomissionskyrka.se/roles'] ?? [];
      if (!hasIntersection(requiredRoles, userRoles)) return { redirect };
    }

    if (handler == null) {
      let props = { user: session.user } as WithUser<P>;
      return { props };
    }

    let handlerResult = await handler(ctx);

    if ('props' in handlerResult) {
      let handlerProps = await handlerResult.props;
      return {
        props: {
          ...handlerProps,
          user: session.user,
        },
      };
    }

    return handlerResult;
  };
}
