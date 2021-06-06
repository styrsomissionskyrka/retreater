import 'styles/main.css';

import { Fragment } from 'react';
import Head from 'next/head';
import { UserProvider } from '@auth0/nextjs-auth0';
import { ApolloProvider } from '@apollo/client';
import { useAppClient } from 'lib/graphql/client';

import { PageWrapper, AdminWrapper } from 'lib/components/PageWrappers';
import { ExtendedAppProps, ExtendedNextComponentType } from 'lib/types/next';
import { useRouter } from 'next/router';

const App: React.FC<ExtendedAppProps> = ({ Component, pageProps }) => {
  console.log(pageProps.initialState);
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
