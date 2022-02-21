import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

import { PolyfillScript } from '../components';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  let router = useRouter();

  let { dehydratedState, ...props } = pageProps;

  const exitPreviewMode = async () => {
    await fetch('/api/preview', { method: 'DELETE' }).catch(console.error);
    router.replace('/');
  };

  return (
    <Fragment>
      <Head>
        <title key="title">Retreater | Styrsö Missionskyrka</title>
        <PolyfillScript key="polyfills" />
      </Head>

      {router.isPreview ? <button onClick={exitPreviewMode}>Exit preview mode</button> : null}

      <Component {...props} />
    </Fragment>
  );
};

export default App;
