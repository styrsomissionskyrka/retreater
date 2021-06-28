import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { gql, TypedDocumentNode, AdminOrderQuery, AdminOrderQueryVariables, useQuery } from 'lib/graphql';
import { authenticatedPage } from 'lib/auth/hocs';
import { Layout } from 'components';
import { assert } from 'lib/utils/assert';
import { format } from 'lib/utils/date-fns';
import { formatMoney } from 'lib/utils/money';

const Order: NextPage = () => {
  const { query } = useRouter();

  let id = query.id;
  assert(typeof id === 'string', 'Invalid id passed to query.');

  const { data, loading } = useQuery(ADMIN_ORDER_QUERY, { variables: { id } });
  const order = data?.order;

  if (loading) return <p>Laddar...</p>;
  if (order == null) return <p>Hittades inte</p>;

  return (
    <RetreatLayout>
      <div className="grid grid-cols-2 items-start gap-4">
        <div>
          <h2 className="mb-2 text-xl">Besökare</h2>
          <dl className="grid grid-cols-2 max-w-xs">
            <dt className="font-semibold">Namn:</dt>
            <dd>{order.name}</dd>

            <dt className="font-semibold">E-post:</dt>
            <dd>{order.email}</dd>

            <dt className="font-semibold">Skapad:</dt>
            <dd>{format(order.createdAt, 'yyyy-MM-dd')}</dd>
          </dl>
        </div>

        <div>
          <h2 className="mb-2 text-xl">Valt pris</h2>
          <dl className="grid grid-cols-2 max-w-xs">
            <dt className="font-semibold">Beskrivning:</dt>
            <dd>{order.price.product.name}</dd>
            <dt className="font-semibold">Pris:</dt>
            <dd>{formatMoney(order.price.amount, order.price.currency)}</dd>
          </dl>
        </div>
      </div>
    </RetreatLayout>
  );
};

export default authenticatedPage(Order);

export const RetreatLayout: React.FC = ({ children }) => {
  return (
    <Layout.Admin title="Bokning" sidebarTitle="Bokning" headerTitle="Bokning" backLink="/admin/bokningar">
      {children}
    </Layout.Admin>
  );
};

export const ADMIN_ORDER_QUERY: TypedDocumentNode<AdminOrderQuery, AdminOrderQueryVariables> = gql`
  query AdminOrder($id: ID!) {
    order(id: $id) {
      id
      createdAt
      updatedAt
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
