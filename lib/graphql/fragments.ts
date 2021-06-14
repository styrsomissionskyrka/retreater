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

export const PAGE_INFO_FRAGMENT = gql`
  fragment PageInfoFields on PageInfo {
    startCursor
    endCursor
    hasNextPage
    hasPreviousPage
  }
`;
