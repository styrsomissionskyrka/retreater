import Head from 'next/head';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react';

import { PolyfillScript } from 'components';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  let { session, ...props } = pageProps;

  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <Head>
          <title key="title">Retreater | Styrsö Missionskyrka</title>
        </Head>
        <PolyfillScript key="polyfills" />
        <Component {...props} />
      </ChakraProvider>
    </SessionProvider>
  );
};

export default App;
