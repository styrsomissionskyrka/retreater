import { useMemo, Fragment } from 'react';
import { NextPage } from 'next';
import { IconRefresh } from '@tabler/icons';

import { gql, RetreatStatusEnum, TypedDocumentNode, useQuery } from 'lib/graphql';
import { authenticatedPage } from 'lib/auth/hocs';
import { authenticatedSSP } from 'lib/auth/server';
import { Layout, DataTable, toast, LoadingButton, Spinner } from 'components';
import { useSearchParams, extractCurrentParams } from 'lib/hooks';
import { compact } from 'lib/utils/array';
import { ListRetreatsQuery, ListRetreatsQueryVariables, OrderEnum, RetreatOrderByEnum } from 'lib/graphql';
import { preloadQueries } from 'lib/graphql/ssr';
import { PAGINATION_FRAGMENT } from 'lib/graphql/fragments';
import { CreateReatreat, useSetRetreatStatus } from 'components/forms';
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
  const [variables, setVariables] = useSearchParams(initialVariables);

  const { previousData, data = previousData, refetch, loading } = useQuery(LIST_RETREATS_QUERY, { variables });
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
        sortable: RetreatOrderByEnum.StartDate,
      }),
      DataTable.Columns.createRelativeDateCell({
        Header: 'Skapad',
        accessor: 'createdAt',
        sortable: RetreatOrderByEnum.CreatedAt,
      }),
      DataTable.Columns.createContextMenuCell({
        accessor: 'id',
        actions: [
          {
            label: 'Publicera',
            disabled: (retreat) => retreat.status === RetreatStatusEnum.Published,
            onClick: (retreat) =>
              toast.promise(setRetreatStatus(retreat.id, RetreatStatusEnum.Published), {
                loading: '...',
                success: 'Retreaten har publicerats.',
                error: 'Kunde inte publicera retreaten.',
              }),
          },
          {
            label: 'Utkast',
            disabled: (retreat) => retreat.status === RetreatStatusEnum.Draft || !retreat.canDeactivate,
            onClick: (retreat) =>
              toast.promise(setRetreatStatus(retreat.id, RetreatStatusEnum.Draft), {
                loading: '...',
                success: 'Retreaten har gjorts om till utkast.',
                error: 'Kunde inte göra om till utkast.',
              }),
          },
          {
            label: 'Arkivera',
            disabled: (retreat) => retreat.status === RetreatStatusEnum.Archived || !retreat.canDeactivate,
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

  const actions = (
    <Fragment>
      <LoadingButton
        square
        size="normal"
        onClick={refetch}
        iconStart={<IconRefresh size={16} />}
        spinner={<Spinner as={IconRefresh} size={16} reverse />}
        aria-label="Uppdatera listan"
      />
      <CreateReatreat />
    </Fragment>
  );

  return (
    <Layout.Admin title="Retreater" backLink="/admin" actions={actions}>
      <DataTable.Provider
        data={retreats}
        columns={columns}
        loading={loading}
        filters={variables}
        setFilters={setVariables}
      >
        <DataTable.Layout>
          <DataTable.Filters<FiltersType> values={variables} setValues={setVariables}>
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
          </DataTable.Filters>

          <DataTable.Table>
            <DataTable.Head />
            <DataTable.Body />
          </DataTable.Table>

          <DataTable.Pagination meta={data?.retreats.paginationMeta} />
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
        canDeactivate
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
