import { SubmitHandler } from 'react-hook-form';

import {
  gql,
  TypedDocumentNode,
  UpdateRetreatMutation,
  UpdateRetreatMutationVariables,
  EditRetreatFieldsFragment,
  useMutation,
  UpdateRetreatInput,
} from 'lib/graphql';

import * as ConnectedForm from '../ConnectedForm';
import { toast } from '../Toast';

interface EditRetreatProps {
  retreat: EditRetreatFieldsFragment;
}

const Form = ConnectedForm.createConnectedFormComponents<UpdateRetreatInput>();

export const EditRetreat: React.FC<EditRetreatProps> = ({ retreat }) => {
  const [mutate] = useMutation(UPDATE_RETREAT_MUTATION);

  const handleSubmit: SubmitHandler<UpdateRetreatInput> = async (input) => {
    await toast.promise(mutate({ variables: { input, id: retreat.id } }), {
      loading: '...',
      success: 'Retreaten har uppdaterats.',
      error: 'Något gick snett.',
    });
  };

  return (
    <Form.Form onSubmit={handleSubmit}>
      <Form.Input name="title" label="Titel" defaultValue={retreat.title ?? ''} />

      <Form.Row>
        <Form.Input name="startDate" type="date" label="Startdatum" required defaultValue={retreat.startDate ?? ''} />
        <Form.Input name="endDate" type="date" label="Slutdatum" required defaultValue={retreat.endDate ?? ''} />
      </Form.Row>
      <Form.Input
        name="maxParticipants"
        type="number"
        label="Max antal deltagare"
        defaultValue={retreat.maxParticipants ?? 10}
        required
        options={{ min: 0, max: 100 }}
      />

      <Form.Markdown name="content" label="Beskrivning" defaultValue={retreat.content ?? ''} />

      <Form.ActionRow>
        <Form.Submit>Uppdatera retreat</Form.Submit>
      </Form.ActionRow>
    </Form.Form>
  );
};

export const EDIT_RETREAT_FRAGMENT = gql`
  fragment EditRetreatFields on Retreat {
    id
    title
    content
    startDate
    endDate
    maxParticipants
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
