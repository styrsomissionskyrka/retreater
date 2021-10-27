import { USER_FRAGMENT } from './fragments';
import { gql, TypedDocumentNode } from './hooks';
import { CurrentUserQuery, CurrentUserQueryVariables } from './generated';

export const ME: TypedDocumentNode<CurrentUserQuery, CurrentUserQueryVariables> = gql`
  query CurrentUser {
    me {
      ...UserFields
    }
  }

  ${USER_FRAGMENT}
`;
