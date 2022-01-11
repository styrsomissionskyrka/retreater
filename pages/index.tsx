import { Link } from 'components';
import { NextPage } from 'next';
import { signIn, signOut } from 'next-auth/react';

const Home: NextPage = () => {
  return (
    <div>
      <Link href="/admin">Admin</Link>
      <button onClick={() => signIn()}>Sign in</button>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default Home;
