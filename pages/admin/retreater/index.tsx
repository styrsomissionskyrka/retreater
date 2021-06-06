import { NextPage } from 'next';
import { IconCalendarEvent, IconChevronDown, IconChevronUp, IconUsers } from '@tabler/icons';
import { gql, useQuery } from '@apollo/client';
import { authenticatedPage, authenticatedSSP } from 'lib/auth/hocs';
import { AdminLayout, NavLinkConfig } from 'lib/components';
import { useUserHasRoles } from 'lib/hooks';
import { compact } from 'lib/utils/array';
import {
  ensureOrderEnum,
  ensureRetreatOrderByEnum,
  ListRetreatsQuery,
  ListRetreatsQueryVariables,
  OrderEnum,
  RetreatOrderByEnum,
} from 'lib/graphql';
import { useSearchParams } from 'lib/hooks/useSearchParams';
import { preloadQueries } from 'lib/graphql/ssr';

const initialVariables: ListRetreatsQueryVariables = {
  page: 1,
  perPage: 2,
  order: OrderEnum.Asc,
  orderBy: RetreatOrderByEnum.CreatedAt,
};

const Retreats: NextPage = () => {
  const isAdmin = useUserHasRoles(['admin', 'superadmin']);
  const navLinks: NavLinkConfig[] = compact([
    { href: '/admin/retreater', label: 'Retreater', icon: <IconCalendarEvent size={16} /> },
    isAdmin ? { href: '/admin/anvandare', label: 'Användare', icon: <IconUsers size={16} /> } : null,
  ]);

  const [variables, setVariables] = useSearchParams(initialVariables);

  const { previousData, data = previousData } = useQuery<ListRetreatsQuery, ListRetreatsQueryVariables>(
    RETREATS_QUERY,
    {
      variables: {
        ...variables,
        page: variables.page - 1,
      },
    },
  );

  if (data == null) return <p>Loading...</p>;

  const retreats = data.retreats.items;
  const pagination = data.retreats.paginationMeta;

  return (
    <AdminLayout title="Retreater" backLink="/admin" navLinks={navLinks}>
      <button
        onClick={() => setVariables({ page: pagination.currentPage - 1 + 1 })}
        disabled={!pagination.hasPreviousPage}
      >
        Previous
      </button>
      <p>{pagination.currentPage + 1}</p>
      <button onClick={() => setVariables({ page: pagination.currentPage + 1 + 1 })} disabled={!pagination.hasNextPage}>
        Next
      </button>

      <select
        value={variables.orderBy}
        onChange={(e) => setVariables({ orderBy: e.currentTarget.value as RetreatOrderByEnum })}
      >
        {Object.values(RetreatOrderByEnum).map((val) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => {
          setVariables((prev) => ({ order: prev.order === OrderEnum.Asc ? OrderEnum.Desc : OrderEnum.Asc }));
        }}
      >
        {variables.order === OrderEnum.Asc ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
      </button>

      {retreats.map((retreat) => (
        <p key={retreat.id}>{retreat.title}</p>
      ))}
    </AdminLayout>
  );
};

const RETREATS_QUERY = gql`
  query ListRetreats($page: Int!, $perPage: Int!, $order: OrderEnum!, $orderBy: RetreatOrderByEnum!) {
    retreats(page: $page, perPage: $perPage, order: $order, orderBy: $orderBy) {
      paginationMeta {
        hasNextPage
        hasPreviousPage
        currentPage
        perPage
        totalPages
        totalItems
      }
      items {
        id
        title
      }
    }
  }
`;

export default authenticatedPage(Retreats);
export const getServerSideProps = authenticatedSSP(
  preloadQueries<ListRetreatsQueryVariables, Record<keyof ListRetreatsQueryVariables, string | undefined>>([
    [
      RETREATS_QUERY,
      (ctx) => ({
        ...initialVariables,
        page: Number(ctx.query.page ?? initialVariables.page) - 1,
        perPage: Number(ctx.query.perPage ?? initialVariables.perPage),
        order: ensureOrderEnum(ctx.query.order, OrderEnum.Asc),
        orderBy: ensureRetreatOrderByEnum(ctx.query.orderBy, RetreatOrderByEnum.CreatedAt),
      }),
    ],
  ]),
);
