import { NextPage } from 'next';
import { useSession } from 'next-auth/react';

export function authenticated<P = {}, IP = P>(Page: NextPage<P, IP>): NextPage<P, IP> {
  const AuthenticatedPage: NextPage<P, IP> = (props) => {
    let { status } = useSession({ required: true });
    if (status === 'loading') return <p>Loading...</p>;
    if (status === 'authenticated') return <Page {...props} />;
    return null;
  };

  AuthenticatedPage.displayName = `authenticated(${Page.displayName ?? Page.name ?? 'UnknownPage'})`;

  if (Page.getInitialProps != null) {
    AuthenticatedPage.getInitialProps = Page.getInitialProps;
  }

  return AuthenticatedPage;
}
