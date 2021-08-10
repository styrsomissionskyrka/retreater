import { Fragment } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import {
  gql,
  TypedDocumentNode,
  AdminOrderQuery,
  AdminOrderQueryVariables,
  AdminCancelOrderMutation,
  AdminCancelOrderMutationVariables,
  useQuery,
  useMutation,
  OrderStatusEnum,
} from 'lib/graphql';
import { authenticatedPage } from 'lib/auth/hocs';
import { assert } from 'lib/utils/assert';
import { format } from 'lib/utils/date-fns';
import { formatMoney } from 'lib/utils/money';
import { CopyInline, Layout, OrderUI, ConfirmButton } from 'components';
import { OrderPaymentsTable, OrderRefundsTable } from 'components/tables';

const Order: NextPage = () => {
  const { query } = useRouter();

  assert(typeof query.id === 'string', 'Invalid id passed to query.');
  let id = query.id;

  const { previousData, data = previousData, loading } = useQuery(ADMIN_ORDER_QUERY, { variables: { id } });
  const order = data?.order;

  const [cancelOrder] = useMutation(ADMIN_CANCEL_ORDER, { variables: { id } });

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
        <OrderUI.PageSection title="Status">
          <OrderUI.StatusMessage id={order.id} />
        </OrderUI.PageSection>

        <OrderUI.PageSection span={1} title="Besökare">
          <OrderUI.DefinitionList
            defs={[
              { key: 'Namn', value: order.name },
              { key: 'E-post', value: order.email, copyable: true },
              { key: 'Skapad', value: format(order.createdAt, 'yyyy-MM-dd HH:mm') },
            ]}
          />
        </OrderUI.PageSection>

        <OrderUI.PageSection span={1} title="Retreat">
          <OrderUI.DefinitionList
            defs={[
              { key: 'Titel', value: order.retreat.title, link: retreatHref },
              {
                key: 'Pris',
                value: `${order.price.product.name}, ${formatMoney(order.price.amount, order.price.currency)}`,
              },
              {
                key: 'Rabatt',
                value:
                  order.coupon == null
                    ? '-'
                    : order.coupon.amountOff
                    ? formatMoney(order.coupon.amountOff, order.coupon.currency ?? 'sek')
                    : `-${order.coupon.percentOff}%`,
              },
            ]}
          />
        </OrderUI.PageSection>

        <OrderUI.PageSection title="Åtgärder">
          <ConfirmButton
            confirmMessage="Är du säker?"
            variant="danger"
            size="small"
            onClick={cancelOrder}
            disabled={order.status === OrderStatusEnum.Cancelled}
            messages={{ success: 'Bokning avbruten', error: 'Kunde inte avbryta bokning' }}
          >
            Avbryt bokning
          </ConfirmButton>
        </OrderUI.PageSection>

        <OrderUI.PageSection title="Betalningar">
          <OrderPaymentsTable id={order.id} />
        </OrderUI.PageSection>

        <OrderUI.PageSection title="Återbetalningar">
          <OrderRefundsTable id={order.id} />
        </OrderUI.PageSection>
      </OrderUI.PageLayout>
    </Layout.Admin>
  );
};

export default authenticatedPage(Order);

const ORDER_FRAGMENT = gql`
  fragment AdminOrderMeta on Order {
    id
    createdAt
    updatedAt
    confirmedAt
    cancelledAt
    status
  }
`;

const ADMIN_ORDER_QUERY: TypedDocumentNode<AdminOrderQuery, AdminOrderQueryVariables> = gql`
  query AdminOrder($id: ID!) {
    order(id: $id) {
      ...AdminOrderMeta
      id
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
      coupon {
        id
        amountOff
        percentOff
        currency
      }
    }
  }

  ${ORDER_FRAGMENT}
`;

const ADMIN_CANCEL_ORDER: TypedDocumentNode<AdminCancelOrderMutation, AdminCancelOrderMutationVariables> = gql`
  mutation AdminCancelOrder($id: ID!) {
    cancelOrder(id: $id) {
      id
      ...AdminOrderMeta
    }
  }

  ${ORDER_FRAGMENT}
`;
