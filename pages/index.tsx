import { NextPage } from 'next';

import { Link } from 'lib/components';

const Home: NextPage = () => {
  return (
    <header>
      <h1>Styrsö Missionskyrka | Retreater</h1>
      <Link href="/admin">Admin</Link>
    </header>
  );
};

export default Home;
