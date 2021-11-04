import { NextPage } from 'next';
import { useMemo } from 'react';
import { useRouter } from 'next/router';

import { authenticatedPage } from 'lib/auth/hocs';
import { authenticatedSSP } from 'lib/auth/server';
import { DataTable, Layout, toast } from 'components';
import { useAuthenticatedUser, useSearchParams } from 'lib/hooks';
import { PAGINATION_FRAGMENT, USER_FRAGMENT } from 'lib/graphql/fragments';
import {
  gql,
  useQuery,
  TypedDocumentNode,
  AdminUsersQuery,
  AdminUsersQueryVariables,
  useRemoveUser,
  OrderEnum,
  UserOrderByEnum,
} from 'lib/graphql';
import { PaginatedType } from 'lib/utils/types';
import { EditUser } from 'components/forms/EditUser';
import { InviteUser } from 'components/forms';

type UserType = PaginatedType<'users', AdminUsersQuery>;
type FiltersType = AdminUsersQueryVariables;

const initialVariables: FiltersType = {
  page: 1,
  perPage: 25,
  order: OrderEnum.Asc,
  orderBy: UserOrderByEnum.CreatedAt,
  search: null,
};

const Users: NextPage = () => {
  const router = useRouter();
  const [variables, setVariables] = useSearchParams(initialVariables);
  const { previousData, data = previousData, loading } = useQuery(USERS_QUERY, { variables });
  const [removeUser] = useRemoveUser();

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
        sortable: UserOrderByEnum.Name,
      }),
      DataTable.Columns.createLinkCell({
        accessor: 'email',
        Header: 'E-post',
        getLink: (row) => `/admin/anvandare/${row.id}`,
        sortable: UserOrderByEnum.Email,
      }),
      {
        accessor: 'roles',
        Header: 'Roller',
        Cell({ value }) {
          return <p>{value.map((role) => role.name).join(', ')}</p>;
        },
      },
      DataTable.Columns.createFormattedDateCell({
        accessor: 'createdAt',
        dateFormat: 'yyyy-MM-dd',
        Header: 'Skapad',
        sortable: UserOrderByEnum.CreatedAt,
      }),
      DataTable.Columns.createContextMenuCell({
        accessor: 'id',
        Header: '',
        actions: [
          {
            label: 'Ta bort',
            disabled: (row) => row.id === user.id,
            onClick: (row) => {
              return toast.promise(removeUser(row.id), {
                loading: 'Laddar...',
                success: 'Användare borttagen',
                error: 'Kunder inte ta bort användare',
              });
            },
          },
          {
            label: 'Redigera',
            onClick: (row) => router.push(`/admin/anvandare/${row.id}`),
          },
        ],
      }),
    ];
  }, [user.id, removeUser, router]);

  const actions = <InviteUser />;
  let userId = Array.isArray(router.query.slug) ? router.query.slug[0] : null;

  return (
    <Layout.Admin title="Användare" backLink="/admin" actions={actions}>
      <DataTable.Provider
        data={users}
        columns={columns}
        loading={loading}
        filters={variables}
        setFilters={setVariables}
      >
        <DataTable.Layout>
          <DataTable.Table>
            <DataTable.Head />
            <DataTable.Body />
          </DataTable.Table>

          <DataTable.Pagination meta={data?.users.paginationMeta}>
            <DataTable.Filters<FiltersType> values={variables} setValues={setVariables}>
              <DataTable.Filters.SearchFilter<FiltersType>
                queryKey="search"
                placeholder="Sök email eller namn"
                label="Sök"
              />
            </DataTable.Filters>
          </DataTable.Pagination>

          <EditUser id={userId} onSuccess={() => router.push('/admin/anvandare')} />
        </DataTable.Layout>
      </DataTable.Provider>
    </Layout.Admin>
  );
};

export const USERS_QUERY: TypedDocumentNode<AdminUsersQuery, AdminUsersQueryVariables> = gql`
  query AdminUsers($page: Int, $perPage: Int, $order: OrderEnum, $orderBy: UserOrderByEnum, $search: String) {
    users(page: $page, perPage: $perPage, order: $order, orderBy: $orderBy, search: $search) {
      paginationMeta {
        ...PaginationFields
      }
      items {
        id
        createdAt
        ...UserFields
        roles {
          id
          name
        }
      }
    }
  }

  ${PAGINATION_FRAGMENT}
  ${USER_FRAGMENT}
`;

export default authenticatedPage(Users);
export const getServerSideProps = authenticatedSSP();
