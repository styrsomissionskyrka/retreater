import 'styles/main.css';

import { Fragment } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { UserProvider } from '@auth0/nextjs-auth0';
import { useAppClient } from 'lib/graphql/client';
import { ApolloProvider } from '@apollo/client';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const client = useAppClient({});
  return (
    <Fragment>
      <Head>
        <title key="title">Retreater | Styrsö Missionskyrka</title>
      </Head>
      <ApolloProvider client={client}>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </ApolloProvider>
    </Fragment>
  );
};

export default App;
