import { NextPage } from 'next';
import { authenticatedPage, authenticatedSSP } from 'lib/auth/hocs';
import { AdminLayout, Link } from 'lib/components';

const Admin: NextPage = () => {
  return (
    <AdminLayout title="Dashboard" backLink="/">
      <Link href={{ pathname: '/admin/logout' }}>Logga ut</Link>
    </AdminLayout>
  );
};

export default authenticatedPage(Admin);
export const getServerSideProps = authenticatedSSP();
