import { gql, TypedDocumentNode, useMutation } from '@apollo/client';
import { ConnectedForm } from 'lib/components';
import {
  EditRetreatFormQuery,
  EditRetreatFormQueryVariables,
  UpdateRetreatInput,
  UpdateRetreatMutation,
  UpdateRetreatMutationVariables,
} from 'lib/graphql';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'lib/components/Toast';

interface EditRetreatProps {
  retreat: NonNullable<EditRetreatFormQuery['retreat']>;
}

const Form = ConnectedForm.createConnectedFormComponents<UpdateRetreatInput>();

export const EditRetreat: React.FC<EditRetreatProps> = ({ retreat }) => {
  const [mutate] = useMutation(UPDATE_RETREAT_MUTATION);

  const onSubmit: SubmitHandler<UpdateRetreatInput> = async (input) => {
    try {
      await mutate({ variables: { id: retreat.id, input } });
      toast.success('Retreaten har uppdaterats.');
    } catch (error) {
      toast.error('Något gick snett.');
      if (process.env.NODE_ENV !== 'production') console.error(error);
    }
  };

  return (
    <Form.Form onSubmit={onSubmit}>
      <Form.Input name="title" type="text" label="Titel" defaultValue={retreat.title} />
      {/* <Form.Input label="Slug" prefix="/retreater/" type="text" readOnly defaultValue={retreat.slug} /> */}
      <Form.Row>
        <Form.Input name="startDate" type="date" label="Startdatum" defaultValue={retreat.startDate ?? ''} />
        <Form.Input name="endDate" type="date" label="Slutdatum" defaultValue={retreat.endDate ?? ''} />
      </Form.Row>
      <Form.Input
        name="maxParticipants"
        type="number"
        label="Max antal deltagare"
        defaultValue={retreat.maxParticipants ?? 10}
        min={0}
        max={100}
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
  fragment retreat on Retreat {
    id
    slug
    title
    content
    startDate
    endDate
    maxParticipants
  }
`;

export const EDIT_RETREAT_FORM_QUERY: TypedDocumentNode<EditRetreatFormQuery, EditRetreatFormQueryVariables> = gql`
  query EditRetreatForm($id: ID!) {
    retreat(id: $id) {
      ...retreat
    }
  }

  ${EDIT_RETREAT_FRAGMENT}
`;

export const UPDATE_RETREAT_MUTATION: TypedDocumentNode<UpdateRetreatMutation, UpdateRetreatMutationVariables> = gql`
  mutation UpdateRetreat($id: ID!, $input: UpdateRetreatInput!) {
    updateRetreat(id: $id, input: $input) {
      ...retreat
    }
  }

  ${EDIT_RETREAT_FRAGMENT}
`;
