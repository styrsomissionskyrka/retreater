import { NextPage } from 'next';
import { useMemo } from 'react';
import { IconSend } from '@tabler/icons';

import { authenticatedPage } from 'lib/auth/hocs';
import { authenticatedSSP } from 'lib/auth/ssr';
import { Button, DataTable, Layout } from 'components';
import { useSearchParams } from 'lib/hooks';

type UserType = { id: string; email: string; name: string; image: string };
type FiltersType = { page: number; perPage: number; search?: string | null };

const initialVariables: FiltersType = {
  page: 1,
  perPage: 25,
  search: null,
};

const Users: NextPage = () => {
  const [variables, setVariables] = useSearchParams(initialVariables);
  let users: UserType[] = [];

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
      <DataTable.Provider data={users} columns={columns} loading={false}>
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

export default authenticatedPage(Users);
export const getServerSideProps = authenticatedSSP();
