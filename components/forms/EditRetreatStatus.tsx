import { useCallback } from 'react';
import { useRouter } from 'next/router';

import {
  gql,
  EditRetreatStatusFieldsFragment,
  UpdateRetreatStatusMutation,
  UpdateRetreatStatusMutationVariables,
  TypedDocumentNode,
  useMutation,
  MutationTuple,
  FetchResult,
  RetreatStatusEnum,
} from 'lib/graphql';
import { Menu, toast } from 'components';

interface EditRetreatStatusProps {
  retreat: EditRetreatStatusFieldsFragment;
}

const label: Record<RetreatStatusEnum, string> = {
  [RetreatStatusEnum.Published]: 'Publicerad',
  [RetreatStatusEnum.Draft]: 'Utkast',
  [RetreatStatusEnum.Archived]: 'Arkiverad',
};

export function useSetRetreatStatus(): [
  (id: string, status: RetreatStatusEnum) => Promise<FetchResult<UpdateRetreatStatusMutation>>,
  MutationTuple<UpdateRetreatStatusMutation, UpdateRetreatStatusMutationVariables>[1],
] {
  const [mutate, data] = useMutation(UPDATE_RETREAT_STATUS_MUTATION, { refetchQueries: ['ListRetreats'] });
  const setRetreatStatus = useCallback(
    (id: string, status: RetreatStatusEnum) => mutate({ variables: { id, status } }),
    [mutate],
  );
  return [setRetreatStatus, data];
}

export const EditRetreatStatus: React.FC<EditRetreatStatusProps> = ({ retreat }) => {
  const router = useRouter();
  const [mutate, { loading }] = useSetRetreatStatus();

  const activateRetreat = () => {
    return toast.promise(mutate(retreat.id, RetreatStatusEnum.Published), {
      loading: '...',
      success: 'Retreaten har publicerats.',
      error: 'Kunde inte ändra status.',
    });
  };

  const draftRetreat = () => {
    return toast.promise(mutate(retreat.id, RetreatStatusEnum.Draft), {
      loading: '...',
      success: 'Retreaten har gjorts om till utkast.',
      error: 'Kunde inte ändra status.',
    });
  };

  const archiveRetreat = async () => {
    await toast.promise(mutate(retreat.id, RetreatStatusEnum.Archived), {
      loading: '...',
      success: 'Retreaten har arkiverats.',
      error: 'Kunde inte ändra status.',
    });
    router.replace('/admin/retreater');
  };

  console.log(retreat);

  return (
    <Menu.Wrapper>
      <Menu.Button loading={loading} disabled={loading}>
        {label[retreat.status]}
      </Menu.Button>
      <Menu.Actions>
        {retreat.status !== RetreatStatusEnum.Published ? (
          <Menu.Action onClick={activateRetreat}>Publicera</Menu.Action>
        ) : null}
        {retreat.status !== RetreatStatusEnum.Draft ? (
          <Menu.Action onClick={draftRetreat} disabled={!retreat.canDeactivate}>
            Utkast
          </Menu.Action>
        ) : null}
        {retreat.status !== RetreatStatusEnum.Archived ? (
          <Menu.Action onClick={archiveRetreat} disabled={!retreat.canDeactivate}>
            Arkivera
          </Menu.Action>
        ) : null}
      </Menu.Actions>
    </Menu.Wrapper>
  );
};

export const EDIT_RETREAT_STATUS_FRAGMENT = gql`
  fragment EditRetreatStatusFields on Retreat {
    id
    status
    canDeactivate
  }
`;

export const UPDATE_RETREAT_STATUS_MUTATION: TypedDocumentNode<
  UpdateRetreatStatusMutation,
  UpdateRetreatStatusMutationVariables
> = gql`
  mutation UpdateRetreatStatus($id: ID!, $status: RetreatStatusEnum!) {
    setRetreatStatus(id: $id, status: $status) {
      ...EditRetreatStatusFields
    }
  }

  ${EDIT_RETREAT_STATUS_FRAGMENT}
`;
