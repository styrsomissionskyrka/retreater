import { useMemo, Fragment } from 'react';
import { NextPage } from 'next';
import { IconCalendarEvent, IconRefresh, IconUsers } from '@tabler/icons';

import { gql, RetreatStatusEnum, TypedDocumentNode, useQuery } from 'lib/graphql';
import { authenticatedPage, authenticatedSSP } from 'lib/auth/hocs';
import { Layout, DataTable, toast, LoadingButton, Spinner } from 'lib/components';
import { useUserHasRoles, useSearchParams, extractCurrentParams } from 'lib/hooks';
import { compact } from 'lib/utils/array';
import { ListRetreatsQuery, ListRetreatsQueryVariables, OrderEnum, RetreatOrderByEnum } from 'lib/graphql';
import { preloadQueries } from 'lib/graphql/ssr';
import { PAGINATION_FRAGMENT } from 'lib/graphql/fragments';
import { CreateReatreat, useSetRetreatStatus } from 'lib/forms';
import { PaginatedType } from 'lib/utils/types';

type RetreatType = PaginatedType<'retreats', ListRetreatsQuery>;
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

  const { previousData, data = previousData, refetch } = useQuery(LIST_RETREATS_QUERY, { variables });
  const [setRetreatStatus] = useSetRetreatStatus();

  const retreats = compact(data?.retreats?.items ?? []);
  const columns = useMemo<DataTable.Column<RetreatType>[]>(() => {
    return [
      DataTable.Columns.createStatusCell({ accessor: 'status' }),
      DataTable.Columns.createLinkCell({
        accessor: 'title',
        Header: 'Titel',
        getLink: (row) => `/admin/retreater/${row.id}`,
      }),
      DataTable.Columns.createProgressCell({
        id: 'bookedParticipants',
        getProgress: (retreat) => ({ progress: retreat.bookedParticipants, total: retreat.maxParticipants }),
        Header: 'Bokningar',
      }),
      DataTable.Columns.createDateRangeCell({
        Header: 'Datum',
        accessor: (row: RetreatType) => ({ start: row.startDate, end: row.endDate }),
      }),
      DataTable.Columns.createRelativeDateCell({ Header: 'Skapad', accessor: 'createdAt' }),
      DataTable.Columns.createContextMenuCell({
        accessor: 'id',
        actions: [
          {
            label: 'Publicera',
            onClick: (retreat) =>
              toast.promise(setRetreatStatus(retreat.id, RetreatStatusEnum.Published), {
                loading: '...',
                success: 'Retreaten har publicerats.',
                error: 'Kunde inte publicera retreaten.',
              }),
          },
          {
            label: 'Utkast',
            onClick: (retreat) =>
              toast.promise(setRetreatStatus(retreat.id, RetreatStatusEnum.Draft), {
                loading: '...',
                success: 'Retreaten har gjorts om till utkast.',
                error: 'Kunde inte göra om till utkast.',
              }),
          },
          {
            label: 'Arkivera',
            onClick: (retreat) =>
              toast.promise(setRetreatStatus(retreat.id, RetreatStatusEnum.Archived), {
                loading: '...',
                success: 'Retreaten har avpublicerats.',
                error: 'Kunde inte avpublicera retreaten.',
              }),
          },
        ],
      }),
    ];
  }, [setRetreatStatus]);

  if (data == null) return <p>Loading...</p>;

  const actions = (
    <Fragment>
      <LoadingButton
        size="square-normal"
        onClick={refetch}
        iconStart={<IconRefresh size={16} />}
        spinner={<Spinner icon={IconRefresh} size={16} />}
        aria-label="Uppdatera listan"
      />
      <CreateReatreat />
    </Fragment>
  );

  return (
    <Layout.Admin title="Retreater" backLink="/admin" navLinks={navLinks} actions={actions}>
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

export const LIST_RETREATS_QUERY: TypedDocumentNode<ListRetreatsQuery, ListRetreatsQueryVariables> = gql`
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
        ...PaginationFields
      }
      items {
        id
        title
        status
        createdAt
        startDate
        endDate
        maxParticipants
        bookedParticipants
      }
    }
  }
`;

export default authenticatedPage(Retreats);
export const getServerSideProps = authenticatedSSP(
  preloadQueries<ListRetreatsQueryVariables>([
    [LIST_RETREATS_QUERY, (ctx) => extractCurrentParams(ctx.query, initialVariables)],
  ]),
);
