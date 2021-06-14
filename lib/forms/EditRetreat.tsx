import { SubmitHandler } from 'react-hook-form';

import { ConnectedForm, toast } from 'lib/components';
import {
  gql,
  TypedDocumentNode,
  UpdateRetreatMutation,
  UpdateRetreatMutationVariables,
  EditRetreatFieldsFragment,
  useMutation,
  UpdateRetreatInput,
} from 'lib/graphql';

interface EditRetreatProps {
  retreat: EditRetreatFieldsFragment;
}

const Form = ConnectedForm.createConnectedFormComponents<UpdateRetreatInput>();

export const EditRetreat: React.FC<EditRetreatProps> = ({ retreat }) => {
  const [mutate] = useMutation(UPDATE_RETREAT_MUTATION);

  const handleSubmit: SubmitHandler<UpdateRetreatInput> = async (input) => {
    await toast.promise(mutate({ variables: { id: retreat.id, input } }), {
      loading: '...',
      success: 'Retreaten har uppdaterats.',
      error: 'Något gick snett.',
    });
  };

  return (
    <Form.Form onSubmit={handleSubmit}>
      <Form.Input name="name" label="Titel" defaultValue={retreat.name ?? ''} />
      <Form.Input name="description" label="Kort beskrivning" defaultValue={retreat.description ?? ''} />

      <Form.ActionRow>
        <Form.Submit>Uppdatera retreat</Form.Submit>
      </Form.ActionRow>
    </Form.Form>
  );
};

export const EDIT_RETREAT_FRAGMENT = gql`
  fragment EditRetreatFields on Retreat {
    id
    name
    description
  }
`;

export const UPDATE_RETREAT_MUTATION: TypedDocumentNode<UpdateRetreatMutation, UpdateRetreatMutationVariables> = gql`
  mutation UpdateRetreat($id: ID!, $input: UpdateRetreatInput!) {
    updateRetreat(id: $id, input: $input) {
      ...EditRetreatFields
    }
  }

  ${EDIT_RETREAT_FRAGMENT}
`;
