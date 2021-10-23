import { useMemo } from 'react';

import {
  gql,
  useQuery,
  TypedDocumentNode,
  ListAdminOrdersQuery,
  ListAdminOrdersQueryVariables,
  OrderEnum,
  OrderOrderByEnum,
  OrderStatusEnum,
} from 'lib/graphql';
import { PAGINATION_FRAGMENT } from 'lib/graphql/fragments';
import { useSearchParams } from 'lib/hooks';
import { compact } from 'lib/utils/array';
import { PaginatedType } from 'lib/utils/types';

import * as DataTable from '../DataTable';

type OrderType = PaginatedType<'orders', ListAdminOrdersQuery>;
type FiltersType = Omit<ListAdminOrdersQueryVariables, 'retreatId'>;

const initialVariables: FiltersType = {
  page: 1,
  perPage: 25,
  order: OrderEnum.Desc,
  orderBy: OrderOrderByEnum.CreatedAt,
  status: null,
  search: null,
};

interface OrdersTableProps {
  retreatId?: string;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ retreatId }) => {
  const [variables, setVariables] = useSearchParams(initialVariables);
  const {
    previousData,
    data = previousData,
    loading,
  } = useQuery(RETREAT_ORDER_QUERY, {
    variables: { ...variables, retreatId },
  });

  const orders = compact(data?.orders?.items ?? []);
  const columns = useMemo<DataTable.Column<OrderType>[]>(() => {
    const getLink = (row: OrderType) => {
      let suffix = retreatId == null ? '' : '?from=retreat';
      return `/admin/bokningar/${row.id}${suffix}`;
    };

    return compact([
      DataTable.Columns.createStatusCell({ accessor: 'status' }),
      DataTable.Columns.createLinkCell({ accessor: 'name', Header: 'Namn', getLink }),
      DataTable.Columns.createLinkCell({ accessor: 'email', Header: 'E-post', getLink }),

      retreatId != null
        ? null
        : DataTable.Columns.createLinkCell({
            accessor: (row: OrderType) => row.retreat.title,
            Header: 'Retreat',
            getLink: (row) => `/admin/retreater/${row.retreat.id}/bokningar`,
          }),

      DataTable.Columns.createRelativeDateCell({ accessor: 'createdAt', Header: 'Skapad' }),
    ]);
  }, [retreatId]);

  let paginationMeta = data?.orders?.paginationMeta;

  return (
    <DataTable.Provider data={orders} columns={columns} loading={loading}>
      <DataTable.Layout>
        <DataTable.Filters<FiltersType> values={variables} setValues={setVariables}>
          <DataTable.Filters.SearchFilter<FiltersType> queryKey="search" placeholder="Sök e-post" />
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
              { value: OrderStatusEnum.Pending, label: 'Väntande' },
              { value: OrderStatusEnum.Cancelled, label: 'Avbruten' },
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

        <DataTable.Pagination meta={paginationMeta} />
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
    retreat {
      id
      title
    }
  }
`;

export const RETREAT_ORDER_QUERY: TypedDocumentNode<ListAdminOrdersQuery, ListAdminOrdersQueryVariables> = gql`
  query ListAdminOrders(
    $page: Int!
    $perPage: Int!
    $order: OrderEnum!
    $orderBy: OrderOrderByEnum!
    $status: OrderStatusEnum
    $retreatId: ID
    $search: String
  ) {
    orders(
      page: $page
      perPage: $perPage
      order: $order
      orderBy: $orderBy
      status: $status
      retreatId: $retreatId
      search: $search
    ) {
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
