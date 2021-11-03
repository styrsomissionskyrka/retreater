import { USER_FRAGMENT } from './fragments';
import { gql, TypedDocumentNode } from './hooks';
import {
  CurrentUserQuery,
  CurrentUserQueryVariables,
  RemoveUserMutation,
  RemoveUserMutationVariables,
  InviteUserMutation,
  InviteUserMutationVariables,
} from './generated';

export const ME: TypedDocumentNode<CurrentUserQuery, CurrentUserQueryVariables> = gql`
  query CurrentUser {
    me {
      id
      ...UserFields
    }
  }

  ${USER_FRAGMENT}
`;

export const REMOVE_USER: TypedDocumentNode<RemoveUserMutation, RemoveUserMutationVariables> = gql`
  mutation RemoveUser($id: ID!) {
    removeUser(id: $id) {
      id
      ...UserFields
    }
  }

  ${USER_FRAGMENT}
`;

export const INVITE_USER: TypedDocumentNode<InviteUserMutation, InviteUserMutationVariables> = gql`
  mutation InviteUser($email: String!, $name: String) {
    inviteUser(email: $email, name: $name) {
      ticket
      user {
        id
        ...UserFields
      }
    }
  }

  ${USER_FRAGMENT}
`;
