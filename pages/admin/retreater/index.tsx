import { NextPage } from 'next';
import { IconCalendarEvent, IconPlus, IconUsers } from '@tabler/icons';
import { gql, TypedDocumentNode, useQuery } from '@apollo/client';
import { authenticatedPage, authenticatedSSP } from 'lib/auth/hocs';
import { Layout, DataTable, Button } from 'lib/components';
import { useUserHasRoles, useSearchParams } from 'lib/hooks';
import { compact } from 'lib/utils/array';
import {
  ensureOrderEnum,
  ensureRetreatOrderByEnum,
  ListRetreatsQuery,
  ListRetreatsQueryVariables,
  OrderEnum,
  RetreatOrderByEnum,
  RetreatStatusEnum,
} from 'lib/graphql';
import { preloadQueries } from 'lib/graphql/ssr';
import { PAGINATION_FRAGMENT } from 'lib/graphql/fragments';
import { useMemo } from 'react';

type RetreatType = ListRetreatsQuery['retreats']['items'][number];
type FiltersType = ListRetreatsQueryVariables;

const initialVariables: FiltersType = {
  page: 1,
  perPage: 25,
  order: OrderEnum.Desc,
  orderBy: RetreatOrderByEnum.CreatedAt,
  status: null,
};

const Retreats: NextPage = () => {
  const isAdmin = useUserHasRoles(['admin', 'superadmin']);
  const navLinks: Layout.NavLinkConfig[] = compact([
    { href: '/admin/retreater', label: 'Retreater', icon: <IconCalendarEvent size={16} /> },
    isAdmin ? { href: '/admin/anvandare', label: 'Användare', icon: <IconUsers size={16} /> } : null,
  ]);

  const [variables, setVariables] = useSearchParams(initialVariables);

  const { previousData, data = previousData } = useQuery(LIST_RETREATS_QUERY, {
    variables: {
      ...variables,
      page: variables.page - 1,
    },
  });

  const retreats = data?.retreats.items ?? [];
  const columns = useMemo<DataTable.Column<RetreatType>[]>(() => {
    return [
      DataTable.Columns.createStatusCell(),
      DataTable.Columns.createLinkCell({
        accessor: 'title',
        Header: 'Titel',
        getLink: (row) => `/admin/retreater/${row.id}`,
      }),
      DataTable.Columns.createDateRangeCell({
        Header: 'Datum',
        accessor: (row: RetreatType) => ({ start: row.startDate, end: row.endDate }),
      }),
      DataTable.Columns.createRelativeDateCell({ Header: 'Skapad', accessor: 'createdAt' }),
    ];
  }, []);

  if (data == null) return <p>Loading...</p>;

  return (
    <Layout.Admin
      title="Retreater"
      backLink="/admin"
      navLinks={navLinks}
      actions={<Button icon={<IconPlus size={16} />}>Ny retreat</Button>}
    >
      <DataTable.Provider data={retreats} columns={columns}>
        <DataTable.Layout>
          <DataTable.Filters<FiltersType> values={variables} setValues={setVariables}>
            <DataTable.Filters.EnumFilter<FiltersType>
              queryKey="orderBy"
              label="Sortera efter"
              possibleValues={[
                { value: RetreatOrderByEnum.CreatedAt, label: 'Skapad' },
                { value: RetreatOrderByEnum.StartDate, label: 'Startdatum' },
                { value: RetreatOrderByEnum.Status, label: 'Status' },
              ]}
            />

            <DataTable.Filters.EnumFilter<FiltersType>
              queryKey="status"
              label="Status"
              allowEmpty
              possibleValues={[
                { value: RetreatStatusEnum.Published, label: 'Publicerad' },
                { value: RetreatStatusEnum.Draft, label: 'Utkast' },
                { value: RetreatStatusEnum.Archived, label: 'Arkiverat' },
              ]}
            />

            <DataTable.Filters.OrderFilter<FiltersType> queryKey="order" />
          </DataTable.Filters>

          <DataTable.Table>
            <DataTable.Head />
            <DataTable.Body />
          </DataTable.Table>

          <DataTable.Pagination meta={data.retreats.paginationMeta} />
        </DataTable.Layout>
      </DataTable.Provider>
    </Layout.Admin>
  );
};

const LIST_RETREATS_QUERY: TypedDocumentNode<ListRetreatsQuery, ListRetreatsQueryVariables> = gql`
  ${PAGINATION_FRAGMENT}

  query ListRetreats(
    $page: Int!
    $perPage: Int!
    $order: OrderEnum!
    $orderBy: RetreatOrderByEnum!
    $status: RetreatStatusEnum
  ) {
    retreats(page: $page, perPage: $perPage, order: $order, orderBy: $orderBy, status: $status) {
      paginationMeta {
        ...Pagination
      }
      items {
        id
        title
        status
        createdAt
        startDate
        endDate
      }
    }
  }
`;

export default authenticatedPage(Retreats);
export const getServerSideProps = authenticatedSSP(
  preloadQueries<ListRetreatsQueryVariables>([
    [
      LIST_RETREATS_QUERY,
      (ctx) => ({
        page: Number(ctx.query.page ?? initialVariables.page) - 1,
        perPage: Number(ctx.query.perPage ?? initialVariables.perPage),
        order: ensureOrderEnum(ctx.query.order, OrderEnum.Asc),
        orderBy: ensureRetreatOrderByEnum(ctx.query.orderBy, RetreatOrderByEnum.CreatedAt),
      }),
    ],
  ]),
);
