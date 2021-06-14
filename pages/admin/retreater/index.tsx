import { useMemo } from 'react';
import { NextPage } from 'next';
import { IconCalendarEvent, IconUsers } from '@tabler/icons';

import { gql, TypedDocumentNode, useQuery } from 'lib/graphql';
import { authenticatedPage, authenticatedSSP } from 'lib/auth/hocs';
import { Layout, DataTable, toast } from 'lib/components';
import { useUserHasRoles, useSearchParams, extractCurrentParams } from 'lib/hooks';
import { compact } from 'lib/utils/array';
import { ListRetreatsQuery, ListRetreatsQueryVariables } from 'lib/graphql';
import { preloadQueries } from 'lib/graphql/ssr';
import { PAGE_INFO_FRAGMENT } from 'lib/graphql/fragments';
import { CreateReatreat, useSetRetreatStatus } from 'lib/forms';
import { isBefore } from 'lib/utils/date-fns';

type RetreatType = NonNullable<
  NonNullable<NonNullable<NonNullable<ListRetreatsQuery['retreats']>['edges']>[number]>['node']
>;
type FiltersType = ListRetreatsQueryVariables;

const initialVariables: FiltersType = {
  first: 25,
  after: null,
  active: null,
};

const Retreats: NextPage = () => {
  const isAdmin = useUserHasRoles(['admin', 'superadmin']);
  const navLinks: Layout.NavLinkConfig[] = compact([
    { href: '/admin/retreater', label: 'Retreater', icon: <IconCalendarEvent size={16} /> },
    isAdmin ? { href: '/admin/anvandare', label: 'Användare', icon: <IconUsers size={16} /> } : null,
  ]);

  const [variables, _] = useSearchParams(initialVariables);

  const { previousData, data = previousData } = useQuery(LIST_RETREATS_QUERY, { variables });
  const [setRetreatStatus] = useSetRetreatStatus();

  const retreats = compact(data?.retreats?.edges?.map((edge) => edge?.node) ?? []);
  const columns = useMemo<DataTable.Column<RetreatType>[]>(() => {
    return [
      DataTable.Columns.createStatusCell({
        accessor: 'active',
        isIndeterminate: (ret) => {
          if (!ret.active) return false;
          let startDate = ret.metadata.startDate;
          if (startDate == null) return false;
          return isBefore(startDate, new Date());
        },
      }),
      DataTable.Columns.createLinkCell({
        accessor: 'name',
        Header: 'Namn',
        getLink: (row) => `/admin/retreater/${row.id}`,
      }),
      DataTable.Columns.createDateRangeCell({
        Header: 'Datum',
        accessor: (row: RetreatType) => ({ start: row.metadata?.startDate, end: row.metadata?.endDate }),
      }),
      DataTable.Columns.createRelativeDateCell({ Header: 'Skapad', accessor: 'created' }),
      DataTable.Columns.createContextMenuCell({
        accessor: 'id',
        actions: [
          {
            label: 'Publicera retreat',
            onClick: (retreat) =>
              toast.promise(setRetreatStatus(retreat.id, true), {
                loading: '...',
                success: 'Retreaten har publicerats.',
                error: 'Kunde inte publicera retreaten.',
              }),
          },
          {
            label: 'Arkivera retreat',
            onClick: (retreat) =>
              toast.promise(setRetreatStatus(retreat.id, false), {
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

  return (
    <Layout.Admin title="Retreater" backLink="/admin" navLinks={navLinks} actions={<CreateReatreat />}>
      <DataTable.Provider data={retreats} columns={columns}>
        <DataTable.Layout>
          <DataTable.Table>
            <DataTable.Head />
            <DataTable.Body />
          </DataTable.Table>
        </DataTable.Layout>
      </DataTable.Provider>
    </Layout.Admin>
  );
};

export const LIST_RETREATS_QUERY: TypedDocumentNode<ListRetreatsQuery, ListRetreatsQueryVariables> = gql`
  ${PAGE_INFO_FRAGMENT}

  query ListRetreats($first: Int!, $after: String, $active: Boolean) {
    retreats(first: $first, after: $after, active: $active) {
      pageInfo {
        ...PageInfoFields
      }
      edges {
        node {
          id
          name
          active
          created
          metadata {
            id
            startDate
            endDate
          }
        }
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
