import { NextPage } from 'next';
import { useUser } from 'lib/hooks';
import { Link } from 'lib/components';

const Home: NextPage = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (user == null) return <a href="/api/auth/login">Login</a>;

  return (
    <header>
      <h1>Styrsö Missionskyrka | Retreater</h1>
      <Link href="/admin">Admin</Link>
    </header>
  );
};

export default Home;
