import { NextPage } from 'next';
import { useMemo } from 'react';
import { IconSend } from '@tabler/icons';

import { authenticatedPage } from 'lib/auth/hocs';
import { authenticatedSSP } from 'lib/auth/ssr';
import { Button, DataTable, Layout } from 'components';
import { TypedDocumentNode, AdminUsersQuery, AdminUsersQueryVariables, gql, useQuery } from 'lib/graphql';
import { PAGINATION_FRAGMENT } from 'lib/graphql/fragments';
import { preloadQueries } from 'lib/graphql/ssr';
import { useSearchParams, extractCurrentParams } from 'lib/hooks';
import { PaginatedType } from 'lib/utils/types';

type UserType = PaginatedType<'users', AdminUsersQuery>;
type FiltersType = AdminUsersQueryVariables;

const initialVariables: FiltersType = {
  page: 1,
  perPage: 25,
  search: null,
};

const Users: NextPage = () => {
  const [variables, setVariables] = useSearchParams(initialVariables);
  const { previousData, data = previousData, loading } = useQuery(LIST_USERS_QUERY, { variables });

  let users = data?.users.items ?? [];

  const columns = useMemo<DataTable.Column<UserType>[]>(() => {
    return [
      DataTable.Columns.createAvatarCell({
        accessor: 'image',
        Header: '',
        alt: (row) => `Profilbild för ${row.name ?? ''}`,
      }),
      DataTable.Columns.createLinkCell({
        accessor: 'name',
        Header: 'Namn',
        getLink: (row) => `/admin/anvandare/${row.id}`,
      }),
      DataTable.Columns.createLinkCell({
        accessor: 'email',
        Header: 'E-post',
        getLink: (row) => `/admin/anvandare/${row.id}`,
      }),
      DataTable.Columns.createContextMenuCell({
        accessor: 'id',
        Header: '',
        actions: [
          {
            label: 'Ta bort',
            onClick: (row) => {},
          },
        ],
      }),
    ];
  }, []);

  const actions = <Button iconStart={<IconSend size={16} />}>Bjud in</Button>;

  return (
    <Layout.Admin title="Användare" backLink="/admin" actions={actions}>
      <DataTable.Provider data={users} columns={columns} loading={loading}>
        <DataTable.Layout>
          <DataTable.Filters<FiltersType> values={variables} setValues={setVariables}>
            <DataTable.Filters.SearchFilter<FiltersType> queryKey="search" placeholder="Sök" />
          </DataTable.Filters>

          <DataTable.Table>
            <DataTable.Head />
            <DataTable.Body />
          </DataTable.Table>

          <DataTable.Pagination meta={data?.users.paginationMeta} />
        </DataTable.Layout>
      </DataTable.Provider>
    </Layout.Admin>
  );
};

export default authenticatedPage(Users);

const LIST_USERS_QUERY: TypedDocumentNode<AdminUsersQuery, AdminUsersQueryVariables> = gql`
  query AdminUsers($page: Int!, $perPage: Int!, $search: String) {
    users(page: $page, perPage: $perPage, search: $search) {
      items {
        id
        name
        email
        image
      }
      paginationMeta {
        ...PaginationFields
      }
    }
  }

  ${PAGINATION_FRAGMENT}
`;

export const getServerSideProps = authenticatedSSP(
  preloadQueries([[LIST_USERS_QUERY, (ctx) => extractCurrentParams<FiltersType>(ctx.query, initialVariables)]]),
);
