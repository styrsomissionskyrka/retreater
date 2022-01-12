import Head from 'next/head';
import { AppProps } from 'next/app';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { useLazyInit } from '@fransvilhelm/hooks';

import { PolyfillScript } from '../components';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const queryClient = useLazyInit(() => new QueryClient());

  let { dehydratedState, ...props } = pageProps;

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <Head>
          <title key="title">Retreater | Styrsö Missionskyrka</title>
        </Head>
        <PolyfillScript key="polyfills" />
        <Component {...props} />
      </Hydrate>
    </QueryClientProvider>
  );
};

export default App;
