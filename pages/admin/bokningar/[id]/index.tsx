import { Fragment } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { gql, TypedDocumentNode, AdminOrderQuery, AdminOrderQueryVariables, useQuery } from 'lib/graphql';
import { authenticatedPage } from 'lib/auth/hocs';
import { assert } from 'lib/utils/assert';
import { format } from 'lib/utils/date-fns';
import { formatMoney } from 'lib/utils/money';
import { CopyInline, Layout, OrderUI } from 'components';

const Order: NextPage = () => {
  const { query } = useRouter();

  let id = query.id;
  assert(typeof id === 'string', 'Invalid id passed to query.');

  const { previousData, data = previousData, loading } = useQuery(ADMIN_ORDER_QUERY, { variables: { id } });
  const order = data?.order;

  if (loading) return <p>Laddar...</p>;
  if (order == null) return <p>Hittades inte</p>;

  let retreatHref = `/admin/retreater/${order.retreat.id}/bokningar`;
  let backLink = query.from === 'retreat' ? retreatHref : '/admin/bokningar';

  return (
    <Layout.Admin
      title="Bokning"
      subTitle={
        <Fragment>
          Referens: <CopyInline>{order.id}</CopyInline>
        </Fragment>
      }
      sidebarTitle="Bokning"
      headerTitle="Bokning"
      backLink={backLink}
    >
      <OrderUI.PageLayout>
        <OrderUI.PageSection area="status" title="Status">
          <OrderUI.StatusMessage id={order.id} />
        </OrderUI.PageSection>

        <OrderUI.PageSection area="owner" title="Besökare">
          <OrderUI.DefinitionList
            defs={[
              { key: 'Namn', value: order.name },
              { key: 'E-post', value: order.email, copyable: true },
              { key: 'Skapad', value: format(order.createdAt, 'yyyy-MM-dd HH:mm') },
            ]}
          />
        </OrderUI.PageSection>

        <OrderUI.PageSection area="retreat" title="Retreat">
          <OrderUI.DefinitionList
            defs={[
              { key: 'Titel', value: order.retreat.title, link: retreatHref },
              {
                key: 'Pris',
                value: `${order.price.product.name}, ${formatMoney(order.price.amount, order.price.currency)}`,
              },
            ]}
          />
        </OrderUI.PageSection>
      </OrderUI.PageLayout>
    </Layout.Admin>
  );
};

export default authenticatedPage(Order);

const ADMIN_ORDER_QUERY: TypedDocumentNode<AdminOrderQuery, AdminOrderQueryVariables> = gql`
  query AdminOrder($id: ID!) {
    order(id: $id) {
      id
      createdAt
      updatedAt
      confirmedAt
      cancelledAt
      status
      name
      email
      retreat {
        id
        title
      }
      price {
        id
        amount
        currency
        product {
          id
          name
          description
        }
      }
      checkoutSessions {
        id
        amount
        currency
        status
      }
    }
  }
`;
