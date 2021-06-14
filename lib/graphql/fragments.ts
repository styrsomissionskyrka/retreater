import gql from 'graphql-tag';

export const PAGINATION_FRAGMENT = gql`
  fragment PaginationFields on PaginationMeta {
    hasNextPage
    hasPreviousPage
    currentPage
    perPage
    totalPages
    totalItems
  }
`;
