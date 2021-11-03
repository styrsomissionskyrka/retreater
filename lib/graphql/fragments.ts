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

export const ROLE_FRAGMENT = gql`
  fragment RoleFields on Role {
    id
    name
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    email
    name
    picture
    nickname
    roles {
      ...RoleFields
    }
  }

  ${ROLE_FRAGMENT}
`;
