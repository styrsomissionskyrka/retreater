import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

import { authenticatedPage } from 'lib/auth/hocs';
import { assert } from 'lib/utils/assert';
import { Order } from 'components/OrderUI';
import { CopyInline } from 'components';

import { RetreatLayout } from '../[[...slug]]';

const RetreatOrder: NextPage = () => {
  const router = useRouter();
  const { id: retreatId, orderId } = router.query;
  assert(typeof retreatId === 'string', 'Id not provided');
  assert(typeof orderId === 'string', 'Order id not provided');

  return (
    <RetreatLayout
      id={retreatId}
      title="Bokning"
      subTitle={
        <Fragment>
          Referens: <CopyInline>{orderId}</CopyInline>
        </Fragment>
      }
    >
      <Order id={orderId} />
    </RetreatLayout>
  );
};

export default authenticatedPage(RetreatOrder);
