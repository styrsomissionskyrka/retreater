import { useRef, useMemo, useState, useCallback, Fragment } from 'react';
import { RenderExpandedRow } from 'react-table';

import {
  AdminOrderPaymentsQuery,
  AdminOrderPaymentsQueryVariables,
  gql,
  TypedDocumentNode,
  useIntersectingQuery,
} from 'lib/graphql';
import { CreateRefund } from 'components/forms/CreateRefund';
import { DataTable, Table, Menu, CopyInline } from 'components';
import { compact } from 'lib/utils/array';
import { formatMoney } from 'lib/utils/money';

type CheckoutSession = NonNullable<AdminOrderPaymentsQuery['order']>['checkoutSessions'][number];

export const OrderPaymentsTable: React.FC<{ id: string }> = ({ id }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { data, loading } = useIntersectingQuery(ADMIN_ORDER_PAYMENTS_QUERY, { variables: { id }, ref });

  const columns = useMemo<DataTable.Column<CheckoutSession>[]>(
    () => [
      { accessor: 'status', Header: 'Status' },
      DataTable.Columns.createCurrencyCell({
        accessor: 'paymentIntent',
        Header: 'Summa',
        getData: (session) => session.paymentIntent ?? {},
      }),
      DataTable.Columns.createCurrencyCell({
        accessor: 'paymentIntent.refunded' as any,
        Header: 'Återbetalt',
        getData: (session) => ({ amount: session.paymentIntent?.refunded, currency: session.paymentIntent?.currency }),
      }),
      DataTable.Columns.createFormattedDateCell({
        accessor: (source: CheckoutSession) => source.paymentIntent?.created,
        dateFormat: 'yyyy-MM-dd HH:mm',
        Header: 'Skapad',
      }),
      {
        accessor: 'id',
        Cell({ row }) {
          const [modal, setModal] = useState<'create_refund' | null>(null);

          let actions = compact([
            row.original.paymentIntent != null &&
            row.original.paymentIntent.refunded < row.original.paymentIntent.amount ? (
              <Menu.Action key="create_refund" onClick={() => setModal('create_refund')}>
                Skapa återbetalning
              </Menu.Action>
            ) : null,
          ]);

          let modals = compact([
            row.original.paymentIntent != null && (
              <CreateRefund
                key="create_refund"
                order={data?.order?.id!}
                paymentIntent={row.original.paymentIntent.id}
                currency={row.original.paymentIntent.currency}
                isOpen={modal === 'create_refund'}
                onDismiss={() => setModal(null)}
              />
            ),
          ]);

          console.log(actions);
          if (actions.length < 1) return null;

          return (
            <Fragment>
              <Menu.Wrapper>
                <Menu.ContextButton />
                <Menu.Actions>{actions}</Menu.Actions>
              </Menu.Wrapper>
              {modals}
            </Fragment>
          );
        },
      },
    ],
    [data?.order?.id],
  );

  const sessions = data?.order?.checkoutSessions ?? [];

  const renderExpandedRow: RenderExpandedRow<CheckoutSession> = useCallback(
    (row) => (
      <div className="space-y-4">
        <Table.Table>
          <Table.Body>
            {row.original.lineItems.map((item) => (
              <Table.BodyRow key={item.id}>
                <Table.BodyCell>{item.price?.product.name ?? 'N/A'}</Table.BodyCell>
                <Table.BodyCell>{formatMoney(item.amountTotal, item.currency)}</Table.BodyCell>
              </Table.BodyRow>
            ))}
          </Table.Body>
        </Table.Table>

        <div className="space-y-1">
          <p>
            <strong>Checkout Session:</strong> <CopyInline value={row.original.id}>{row.original.id}</CopyInline>
          </p>
          <p>
            <strong>Payment Intent:</strong>{' '}
            <CopyInline value={row.original.paymentIntent?.id ?? ''}>{row.original.paymentIntent?.id}</CopyInline>
          </p>
        </div>
      </div>
    ),
    [],
  );

  return (
    <div ref={ref}>
      <DataTable.Provider
        data={sessions}
        columns={columns}
        loading={loading}
        renderExpandedRow={renderExpandedRow}
        hooks={[DataTable.Plugins.useExpanded]}
      >
        <DataTable.Layout>
          <DataTable.Table>
            <DataTable.Head />
            <DataTable.Body empty="Inga betalningar genomförda eller påbörjade." />
          </DataTable.Table>
        </DataTable.Layout>
      </DataTable.Provider>
    </div>
  );
};

const ADMIN_ORDER_PAYMENTS_QUERY: TypedDocumentNode<AdminOrderPaymentsQuery, AdminOrderPaymentsQueryVariables> = gql`
  query AdminOrderPayments($id: ID!) {
    order(id: $id) {
      id
      checkoutSessions {
        id
        status
        amount
        currency
        lineItems {
          id
          amountTotal
          currency
          price {
            id
            product {
              id
              name
            }
          }
        }
        paymentIntent {
          id
          created
          amount
          currency
          refunded
        }
      }
    }
  }
`;
