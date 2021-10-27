import { NextPage } from 'next';

import { authenticatedPage } from 'lib/auth/hocs';
import { authenticatedSSP } from 'lib/auth/ssr';
import { Layout } from 'components';

const Admin: NextPage = () => {
  return <Layout.Admin title="Dashboard">{null}</Layout.Admin>;
};

export default authenticatedPage(Admin);
export const getServerSideProps = authenticatedSSP();
