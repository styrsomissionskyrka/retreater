import 'styles/main.css';

import { Fragment } from 'react';
import Head from 'next/head';
import { UserProvider } from '@auth0/nextjs-auth0';
import { ApolloProvider } from '@apollo/client';
import { useRouter } from 'next/router';

import { useAppClient } from 'lib/graphql/client';
import { PageWrapper, AdminWrapper } from 'lib/components/PageWrappers';
import { ExtendedAppProps, ExtendedNextComponentType } from 'lib/types/next';
import { Toaster } from 'lib/components/Toast';

const App: React.FC<ExtendedAppProps> = ({ Component, pageProps }) => {
  const client = useAppClient({ initialState: pageProps.initialState });
  const Layout = useDefaultLayout(Component);

  return (
    <Fragment>
      <Head>
        <title key="title">Retreater | Styrsö Missionskyrka</title>
      </Head>
      <ApolloProvider client={client}>
        <UserProvider user={pageProps.user}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserProvider>
      </ApolloProvider>
      <Toaster />
    </Fragment>
  );
};

export default App;

function useDefaultLayout(comp: ExtendedNextComponentType<any>): React.ComponentType {
  const router = useRouter();

  if (comp.wrapper != null) return comp.wrapper;
  if (router.pathname.startsWith('/admin')) return AdminWrapper;
  return PageWrapper;
}
