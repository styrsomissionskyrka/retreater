import 'styles/main.css';
import 'tailwindcss/tailwind.css';

import { Fragment } from 'react';
import { AppProps } from 'next/app';
import { BrandHead } from 'lib/components';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Fragment>
      <BrandHead />
      <div className="min-h-screen bg-yellow-100">
        <Component {...pageProps} />
      </div>
    </Fragment>
  );
};

export default App;
