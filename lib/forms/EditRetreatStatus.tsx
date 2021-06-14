import {
  gql,
  EditRetreatStatusFieldsFragment,
  UpdateRetreatStatusMutation,
  UpdateRetreatStatusMutationVariables,
  TypedDocumentNode,
  useMutation,
} from 'lib/graphql';
import { toast } from 'lib/components';
import { Menu } from 'lib/components';

interface EditRetreatStatusProps {
  retreat: EditRetreatStatusFieldsFragment;
}

export const EditRetreatStatus: React.FC<EditRetreatStatusProps> = ({ retreat }) => {
  const [mutate, { loading }] = useMutation(UPDATE_RETREAT_STATUS_MUTATION);

  const activateRetreat = () => {
    return toast.promise(mutate({ variables: { id: retreat.id, active: true } }), {
      loading: '...',
      success: 'Retreaten har publicerats.',
      error: 'Kunde inte ändra status.',
    });
  };

  const deactivateRetreat = () => {
    return toast.promise(mutate({ variables: { id: retreat.id, active: false } }), {
      loading: '...',
      success: 'Retreaten har avpublicerats.',
      error: 'Kunde inte ändra status.',
    });
  };

  return (
    <Menu.Wrapper>
      <Menu.Button loading={loading} disabled={loading}>
        {retreat.active ? 'Publicerad' : 'Utkast'}
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
