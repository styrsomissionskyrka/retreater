import 'styles/main.css';

import { Fragment } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';

import { PolyfillScript } from 'components';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Fragment>
      <Head>
        <title key="title">Retreater | Styrsö Missionskyrka</title>
      </Head>
      <PolyfillScript key="polyfills" />
      <Component {...pageProps} />
    </Fragment>
  );
};

export default App;
