import { Fragment } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';

import { Link, Logotype } from 'lib/components';

const Home: NextPage = () => {
  return (
    <Fragment>
      <Head>
        <title key="title">Retreater | Styrsö Missionskyrka</title>
      </Head>
      <div className="space-y-4">
        <header className="w-full px-4 pt-4">
          <Link href="/" className="flex space-x-2 items-center w-full">
            <span className="text-2xl text-brand">
              <Logotype baseline />
            </span>
            <span>Retreater</span>
          </Link>
        </header>

        <main className="w-full px-4">
          <h1 className="font-medium text-black">Kommande retreater</h1>
        </main>
      </div>
    </Fragment>
  );
};

export default Home;
