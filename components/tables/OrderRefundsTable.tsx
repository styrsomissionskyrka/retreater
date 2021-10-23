import { useRef, useMemo, useCallback } from 'react';
import { RenderExpandedRow } from 'react-table';

import {
  AdminOrderRefundsQuery,
  AdminOrderRefundsQueryVariables,
  gql,
  TypedDocumentNode,
  useIntersectingQuery,
} from 'lib/graphql';

import * as DataTable from '../DataTable';
import { CopyInline } from '../CopyInline';

type Refund = NonNullable<AdminOrderRefundsQuery['order']>['refunds'][number];

export const OrderRefundsTable: React.FC<{ id: string }> = ({ id }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { data, loading } = useIntersectingQuery(ADMIN_ORDER_REFUNDS_QUERY, { variables: { id }, ref });

  const columns = useMemo<DataTable.Column<Refund>[]>(
    () => [
      DataTable.Columns.createCurrencyCell({ accessor: 'amount', Header: 'Summa' }),
      { accessor: 'status', Header: 'Status' },
      { accessor: 'reason', Header: 'Anledning' },
      DataTable.Columns.createFormattedDateCell({
        accessor: 'created',
        dateFormat: 'yyyy-MM-dd HH:mm',
        Header: 'Skapad',
      }),
    ],
    [],
  );

  const refunds = data?.order?.refunds ?? [];

  const renderExpandedRow: RenderExpandedRow<Refund> = useCallback(
    (row) => (
      <div className="space-y-1">
        <p>
          <strong>Refund:</strong> <CopyInline value={row.original.id}>{row.original.id}</CopyInline>
        </p>
      </div>
    ),
    [],
  );

  return (
    <div ref={ref}>
      <DataTable.Provider
        data={refunds}
        columns={columns}
        loading={loading}
        renderExpandedRow={renderExpandedRow}
        hooks={[DataTable.Plugins.useExpanded]}
      >
        <DataTable.Layout>
          <DataTable.Table>
            <DataTable.Head />
            <DataTable.Body empty="Inga återbetalningar genomförda eller påbörjade." />
          </DataTable.Table>
        </DataTable.Layout>
      </DataTable.Provider>
    </div>
  );
};

const ADMIN_ORDER_REFUNDS_QUERY: TypedDocumentNode<AdminOrderRefundsQuery, AdminOrderRefundsQueryVariables> = gql`
  query AdminOrderRefunds($id: ID!) {
    order(id: $id) {
      id
      refunds {
        id
        created
        amount
        currency
        status
        reason
      }
    }
  }
`;
