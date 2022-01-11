import 'styles/main.css';

import { Fragment } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import { PolyfillScript } from 'components';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  let { session, ...props } = pageProps;

  return (
    <SessionProvider session={session}>
      <Fragment>
        <Head>
          <title key="title">Retreater | Styrsö Missionskyrka</title>
        </Head>
        <PolyfillScript key="polyfills" />
        <Component {...props} />
      </Fragment>
    </SessionProvider>
  );
};

export default App;
