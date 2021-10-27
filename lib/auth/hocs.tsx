import { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

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
