import 'styles/main.css';

import { Fragment } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';

import { globalStyles } from 'styles/global';
import { ApolloProvider } from 'lib/graphql';
import { useAppClient } from 'lib/graphql/client';
import { PageWrapper, AdminWrapper } from 'components/PageWrappers';
import { ExtendedAppProps, ExtendedNextComponentType } from 'lib/types/next';
import { PolyfillScript, Toaster, PageLoading } from 'components';

const App: React.FC<ExtendedAppProps> = ({ Component, pageProps }) => {
  const client = useAppClient({ initialState: pageProps.initialState });
  const Layout = useDefaultLayout(Component);

  globalStyles();

  return (
    <Fragment>
      <Head>
        <title key="title">Retreater | Styrsö Missionskyrka</title>
      </Head>
      <PolyfillScript key="polyfills" />
      <PageLoading />
      <SessionProvider session={pageProps.session}>
        <ApolloProvider client={client}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </SessionProvider>
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
