import { NextPage } from 'next';
import { useMemo } from 'react';
import { IconSend } from '@tabler/icons';
import { useRouter } from 'next/router';

import { authenticatedPage } from 'lib/auth/hocs';
import { authenticatedSSP } from 'lib/auth/server';
import { Button, DataTable, Layout } from 'components';
import { useAuthenticatedUser, useSearchParams } from 'lib/hooks';
import { PAGINATION_FRAGMENT } from 'lib/graphql/fragments';
import { gql, useQuery, TypedDocumentNode, AdminUsersQuery, AdminUsersQueryVariables } from 'lib/graphql';
import { PaginatedType } from 'lib/utils/types';

type UserType = PaginatedType<'users', AdminUsersQuery>;
type FiltersType = AdminUsersQueryVariables;

const initialVariables: FiltersType = {
  page: 1,
  perPage: 25,
  search: null,
};

const Users: NextPage = () => {
  const router = useRouter();
  const [variables, setVariables] = useSearchParams(initialVariables);
  const { previousData, data = previousData, loading } = useQuery(USERS_QUERY, { variables });
  let users = data?.users.items ?? [];
  let user = useAuthenticatedUser();

  const columns = useMemo<DataTable.Column<UserType>[]>(() => {
    return [
      DataTable.Columns.createAvatarCell({
        accessor: 'picture',
        Header: '',
        alt: (row) => `Profilbild för ${row.name ?? ''}`,
      }),
      DataTable.Columns.createLinkCell<UserType>({
        accessor: (row) => `${row.name}${row.id === user.id ? ' (jag)' : ''}`,
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
            disabled: (row) => row.id === user.id,
            onClick: (row) => {},
          },
          {
            label: 'Redigera',
            onClick: (row) => router.push(`${router.asPath}/${row.id}`),
          },
        ],
      }),
    ];
  }, [user, router]);

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

          <DataTable.Pagination meta={undefined} />
        </DataTable.Layout>
      </DataTable.Provider>
    </Layout.Admin>
  );
};

export const USERS_QUERY: TypedDocumentNode<AdminUsersQuery, AdminUsersQueryVariables> = gql`
  query AdminUsers($page: Int, $perPage: Int, $search: String) {
    users(page: $page, perPage: $perPage, search: $search) {
      paginationMeta {
        ...PaginationFields
      }
      items {
        id
        email
        name
        picture
      }
    }
  }

  ${PAGINATION_FRAGMENT}
`;

export default authenticatedPage(Users);
export const getServerSideProps = authenticatedSSP();
