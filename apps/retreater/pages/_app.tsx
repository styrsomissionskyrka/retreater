import Head from 'next/head';
import { AppProps } from 'next/app';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { useLazyInit } from '@fransvilhelm/hooks';
import { useRouter } from 'next/router';

import { PolyfillScript } from '../components';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  let router = useRouter();
  let queryClient = useLazyInit(() => new QueryClient());

  let { dehydratedState, ...props } = pageProps;

  const exitPreviewMode = async () => {
    await fetch('/api/preview', { method: 'DELETE' }).catch(console.error);
    router.replace('/');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <Head>
          <title key="title">Retreater | Styrsö Missionskyrka</title>
          <PolyfillScript key="polyfills" />
        </Head>

        {router.isPreview ? (
          <button onClick={exitPreviewMode}>Exit preview mode</button>
        ) : null}

        <Component {...props} />
      </Hydrate>
    </QueryClientProvider>
  );
};

export default App;
