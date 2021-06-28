import { NextPage } from 'next';

import { authenticatedPage } from 'lib/auth/hocs';
import { Layout } from 'lib/components';
import { OrdersTable } from 'lib/tables/OrdersTable';

const Bokningar: NextPage = () => {
  return (
    <Layout.Admin title="Bokningar" backLink="/admin">
      <OrdersTable />
    </Layout.Admin>
  );
};

export default authenticatedPage(Bokningar);
