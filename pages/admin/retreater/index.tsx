import { NextPage } from 'next';
import { IconCalendarEvent, IconChevronDown, IconChevronUp, IconUsers } from '@tabler/icons';
import { gql, TypedDocumentNode, useQuery } from '@apollo/client';
import { authenticatedPage, authenticatedSSP } from 'lib/auth/hocs';
import { AdminLayout, EnumFilter, Filters, NavLinkConfig, OrderFilter, Pagination, SearchFilter } from 'lib/components';
import { useUserHasRoles, useSearchParams } from 'lib/hooks';
import { compact } from 'lib/utils/array';
import {
  ensureOrderEnum,
  ensureRetreatOrderByEnum,
  ListRetreatsQuery,
  ListRetreatsQueryVariables,
  OrderEnum,
  RetreatOrderByEnum,
} from 'lib/graphql';
import { preloadQueries } from 'lib/graphql/ssr';
import { PAGINATION_FRAGMENT } from 'lib/graphql/fragments';

const initialVariables: ListRetreatsQueryVariables & { search: string } = {
  page: 1,
  perPage: 25,
  order: OrderEnum.Asc,
  orderBy: RetreatOrderByEnum.CreatedAt,
  search: '',
};

const Retreats: NextPage = () => {
  const isAdmin = useUserHasRoles(['admin', 'superadmin']);
  const navLinks: NavLinkConfig[] = compact([
    { href: '/admin/retreater', label: 'Retreater', icon: <IconCalendarEvent size={16} /> },
    isAdmin ? { href: '/admin/anvandare', label: 'Användare', icon: <IconUsers size={16} /> } : null,
  ]);

  const [variables, setVariables] = useSearchParams(initialVariables);

  const { previousData, data = previousData } = useQuery(LIST_RETREATS_QUERY, {
    variables: {
      ...variables,
      page: variables.page - 1,
      search: variables.search === '' ? null : variables.search,
    },
  });

  if (data == null) return <p>Loading...</p>;

  const retreats = data.retreats.items;

  return (
    <AdminLayout title="Retreater" backLink="/admin" navLinks={navLinks}>
      <Pagination meta={data.retreats.paginationMeta} itemsOnPage={retreats.length} />

      <Filters>
        <EnumFilter
          value={variables.orderBy}
          setValue={(next) => setVariables({ orderBy: next })}
          possibleValues={[
            { value: RetreatOrderByEnum.CreatedAt, label: 'Skapad' },
            { value: RetreatOrderByEnum.StartDate, label: 'Startdatum' },
            { value: RetreatOrderByEnum.Status, label: 'Status' },
          ]}
        />
        <OrderFilter order={variables.order} setOrder={(next) => setVariables({ order: next })} />
        <SearchFilter value={variables.search} setValue={(next) => setVariables({ search: next })} />
      </Filters>

      {retreats.map((retreat) => (
        <p key={retreat.id}>{retreat.title}</p>
      ))}
    </AdminLayout>
  );
};

const LIST_RETREATS_QUERY: TypedDocumentNode<ListRetreatsQuery, ListRetreatsQueryVariables> = gql`
  ${PAGINATION_FRAGMENT}

  query ListRetreats($page: Int!, $perPage: Int!, $order: OrderEnum!, $orderBy: RetreatOrderByEnum!, $search: String) {
    retreats(page: $page, perPage: $perPage, order: $order, orderBy: $orderBy, search: $search) {
      paginationMeta {
        ...Pagination
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
  preloadQueries<Record<keyof ListRetreatsQueryVariables, string | undefined>>([
    [
      LIST_RETREATS_QUERY,
      (ctx): ListRetreatsQueryVariables => ({
        page: Number(ctx.query.page ?? initialVariables.page) - 1,
        perPage: Number(ctx.query.perPage ?? initialVariables.perPage),
        order: ensureOrderEnum(ctx.query.order, OrderEnum.Asc),
        orderBy: ensureRetreatOrderByEnum(ctx.query.orderBy, RetreatOrderByEnum.CreatedAt),
        search: ctx.query.search === '' ? null : typeof ctx.query.search === 'string' ? ctx.query.search : null,
      }),
    ],
  ]),
);
