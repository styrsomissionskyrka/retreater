import { Fragment } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { authenticatedPage } from 'lib/auth/hocs';
import { assert } from 'lib/utils/assert';
import { CopyInline, Layout } from 'components';
import { Order as OrderPage } from 'components/OrderUI';

const Order: NextPage = () => {
  const { query } = useRouter();
  assert(typeof query.id === 'string', 'Invalid id passed to query.');

  return (
    <Layout.Admin
      title="Bokning"
      subTitle={
        <Fragment>
          Referens: <CopyInline>{query.id}</CopyInline>
        </Fragment>
      }
      sidebarTitle="Bokning"
      headerTitle="Bokning"
      backLink="/admin/bokningar"
    >
      <OrderPage id={query.id} />
    </Layout.Admin>
  );
};

export default authenticatedPage(Order);
