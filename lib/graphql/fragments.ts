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

export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    name
    email
    image
  }
`;
