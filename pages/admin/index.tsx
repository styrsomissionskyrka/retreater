import { NextPage } from 'next';
import { authenticatedPage, authenticatedSSP } from 'lib/auth/hocs';
import { Link } from 'lib/components';

const Admin: NextPage = () => {
  return (
    <div>
      <p>Admin</p>
      <Link href={{ pathname: '/admin/logout' }}>Logga ut</Link>
    </div>
  );
};

export default authenticatedPage(Admin);
export const getServerSideProps = authenticatedSSP();
