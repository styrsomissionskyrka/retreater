import { NextPage } from 'next';

import { authenticatedPage } from 'lib/auth/hocs';
import { authenticatedSSP } from 'lib/auth/ssr';
import { Layout } from 'components';

const Users: NextPage = () => {
  return (
    <Layout.Admin title="Användare" backLink="/admin">
      {null}
    </Layout.Admin>
  );
};

export default authenticatedPage(Users);
export const getServerSideProps = authenticatedSSP();
