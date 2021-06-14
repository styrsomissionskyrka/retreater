import { useCallback } from 'react';

import {
  gql,
  EditRetreatStatusFieldsFragment,
  UpdateRetreatStatusMutation,
  UpdateRetreatStatusMutationVariables,
  TypedDocumentNode,
  useMutation,
  MutationTuple,
  FetchResult,
} from 'lib/graphql';
import { Menu, toast } from 'lib/components';

interface EditRetreatStatusProps {
  retreat: EditRetreatStatusFieldsFragment;
}

export function useSetRetreatStatus(): [
  (id: string, active: boolean) => Promise<FetchResult<UpdateRetreatStatusMutation>>,
  MutationTuple<UpdateRetreatStatusMutation, UpdateRetreatStatusMutationVariables>[1],
] {
  const [mutate, data] = useMutation(UPDATE_RETREAT_STATUS_MUTATION);
  const setRetreatStatus = useCallback(
    (id: string, active: boolean) => mutate({ variables: { id, active } }),
    [mutate],
  );
  return [setRetreatStatus, data];
}

export const EditRetreatStatus: React.FC<EditRetreatStatusProps> = ({ retreat }) => {
  const [mutate, { loading }] = useSetRetreatStatus();

  const activateRetreat = () => {
    return toast.promise(mutate(retreat.id, true), {
      loading: '...',
      success: 'Retreaten har publicerats.',
      error: 'Kunde inte ändra status.',
    });
  };

  const deactivateRetreat = () => {
    return toast.promise(mutate(retreat.id, false), {
      loading: '...',
      success: 'Retreaten har avpublicerats.',
      error: 'Kunde inte ändra status.',
    });
  };

  return (
    <Menu.Wrapper>
      <Menu.Button loading={loading} disabled={loading}>
        {retreat.active ? 'Publicerad' : 'Arkiverad'}
      </Menu.Button>
      <Menu.Actions>
        <Menu.Action onClick={activateRetreat}>Publicera retreat</Menu.Action>
        <Menu.Action onClick={deactivateRetreat}>Arkivera retreat</Menu.Action>
      </Menu.Actions>
    </Menu.Wrapper>
  );
};

export const EDIT_RETREAT_STATUS_FRAGMENT = gql`
  fragment EditRetreatStatusFields on Retreat {
    id
    active
  }
`;

export const UPDATE_RETREAT_STATUS_MUTATION: TypedDocumentNode<
  UpdateRetreatStatusMutation,
  UpdateRetreatStatusMutationVariables
> = gql`
  mutation UpdateRetreatStatus($id: ID!, $active: Boolean!) {
    setRetreatStatus(id: $id, active: $active) {
      ...EditRetreatStatusFields
    }
  }

  ${EDIT_RETREAT_STATUS_FRAGMENT}
`;
