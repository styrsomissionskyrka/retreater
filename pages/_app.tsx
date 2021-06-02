import 'styles/main.css';

import { Fragment } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { UserProvider } from '@auth0/nextjs-auth0';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Fragment>
      <Head>
        <title key="title">Retreater | Styrsö Missionskyrka</title>
      </Head>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </Fragment>
  );
};

export default App;
