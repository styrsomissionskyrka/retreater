import { NextPage } from 'next';
import { useUser } from 'lib/hooks';
import { authenticatedPage, authenticatedSSP } from 'lib/auth/hocs';

const Admin: NextPage = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (user == null) return <a href="/api/auth/login">Login</a>;

  return <p>Admin</p>;
};

export default authenticatedPage(Admin);
export const getServerSideProps = authenticatedSSP();
