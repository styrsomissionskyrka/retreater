import { useMemo } from 'react';

import {
  gql,
  useQuery,
  TypedDocumentNode,
  RetreatOrdersQuery,
  RetreatOrdersQueryVariables,
  OrderEnum,
  OrderOrderByEnum,
  OrderStatusEnum,
} from 'lib/graphql';
import { PAGINATION_FRAGMENT } from 'lib/graphql/fragments';
import { useSearchParams } from 'lib/hooks';
import { compact } from 'lib/utils/array';
import { PaginatedType } from 'lib/utils/types';
import { DataTable } from 'lib/components';

type OrderType = PaginatedType<'orders', RetreatOrdersQuery>;
type FiltersType = Omit<RetreatOrdersQueryVariables, 'retreatId'>;

const initialVariables: FiltersType = {
  page: 1,
  perPage: 25,
  order: OrderEnum.Desc,
  orderBy: OrderOrderByEnum.CreatedAt,
  status: null,
};

interface RetreatOrdersTableProps {
  retreatId: string;
}

export const RetreatOrdersTable: React.FC<RetreatOrdersTableProps> = ({ retreatId }) => {
  const [variables, setVariables] = useSearchParams(initialVariables);
  const { previousData, data = previousData } = useQuery(RETREAT_ORDER_QUERY, {
    variables: { ...variables, retreatId },
  });

  const orders = compact(data?.orders?.items ?? []);
  const columns = useMemo<DataTable.Column<OrderType>[]>(
    () => [
      DataTable.Columns.createStatusCell({ accessor: 'status' }),
      { accessor: 'name', Header: 'Namn' },
      { accessor: 'email', Header: 'E-post' },
      DataTable.Columns.createRelativeDateCell({ accessor: 'createdAt', Header: 'Skapad' }),
    ],
    [],
  );

  if (data == null) return <p>Laddar...</p>;

  let paginationMeta = data?.orders?.paginationMeta;

  return (
    <DataTable.Provider data={orders} columns={columns}>
      <DataTable.Layout>
        <DataTable.Filters<FiltersType> values={variables} setValues={setVariables}>
          <DataTable.Filters.EnumFilter<FiltersType>
            queryKey="orderBy"
            label="Sortera efter"
            possibleValues={[
              { value: OrderOrderByEnum.CreatedAt, label: 'Skapad' },
              { value: OrderOrderByEnum.Status, label: 'Status' },
            ]}
          />

          <DataTable.Filters.EnumFilter<FiltersType>
            queryKey="status"
            label="Status"
            allowEmpty
            possibleValues={[
              { value: OrderStatusEnum.Created, label: 'Skapad' },
              { value: OrderStatusEnum.Confirmed, label: 'Bekräftad' },
              { value: OrderStatusEnum.Pending, label: 'Väntanded' },
              { value: OrderStatusEnum.Cancelled, label: 'Cancellerad' },
              { value: OrderStatusEnum.Declined, label: 'Avvisad' },
              { value: OrderStatusEnum.Errored, label: 'Felaktig' },
            ]}
          />

          <DataTable.Filters.OrderFilter<FiltersType> queryKey="order" />
        </DataTable.Filters>

        <DataTable.Table>
          <DataTable.Head />
          <DataTable.Body />
        </DataTable.Table>

        {paginationMeta ? <DataTable.Pagination meta={paginationMeta} /> : null}
      </DataTable.Layout>
    </DataTable.Provider>
  );
};

const ORDER_FRAGMENT = gql`
  fragment RetreatOrder on Order {
    id
    createdAt
    status
    email
    name
  }
`;

const RETREAT_ORDER_QUERY: TypedDocumentNode<RetreatOrdersQuery, RetreatOrdersQueryVariables> = gql`
  query RetreatOrders(
    $page: Int!
    $perPage: Int!
    $order: OrderEnum!
    $orderBy: OrderOrderByEnum!
    $status: OrderStatusEnum
    $retreatId: ID!
  ) {
    orders(page: $page, perPage: $perPage, order: $order, orderBy: $orderBy, status: $status, retreatId: $retreatId) {
      paginationMeta {
        ...PaginationFields
      }
      items {
        ...RetreatOrder
      }
    }
  }

  ${PAGINATION_FRAGMENT}
  ${ORDER_FRAGMENT}
`;
