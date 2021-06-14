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
  UpdateRetreatMetadataInput,
} from 'lib/graphql';

interface EditRetreatProps {
  retreat: EditRetreatFieldsFragment;
}

interface FormValues {
  retreat: UpdateRetreatInput;
  metadata: UpdateRetreatMetadataInput;
}

const Form = ConnectedForm.createConnectedFormComponents<FormValues>();

export const EditRetreat: React.FC<EditRetreatProps> = ({ retreat }) => {
  const [mutate] = useMutation(UPDATE_RETREAT_MUTATION);

  const handleSubmit: SubmitHandler<FormValues> = async (input) => {
    await toast.promise(mutate({ variables: { ...input, retreatId: retreat.id, metadataId: retreat.metadata.id } }), {
      loading: '...',
      success: 'Retreaten har uppdaterats.',
      error: 'Något gick snett.',
    });
  };

  return (
    <Form.Form onSubmit={handleSubmit}>
      <Form.Input name="retreat.name" label="Titel" defaultValue={retreat.name ?? ''} />

      <Form.Row>
        <Form.Input
          name="metadata.startDate"
          type="date"
          label="Startdatum"
          required
          defaultValue={retreat.metadata.startDate ?? ''}
        />
        <Form.Input
          name="metadata.endDate"
          type="date"
          label="Slutdatum"
          required
          defaultValue={retreat.metadata.endDate ?? ''}
        />
      </Form.Row>
      <Form.Input
        name="metadata.maxParticipants"
        type="number"
        label="Max antal deltagare"
        defaultValue={retreat.metadata.maxParticipants ?? 10}
        required
        options={{ min: 0, max: 100 }}
      />

      <Form.Input name="retreat.description" label="Kort beskrivning" defaultValue={retreat.description ?? ''} />
      <Form.Markdown name="metadata.content" label="Beskrivning" defaultValue={retreat.metadata.content ?? ''} />

      <Form.ActionRow>
        <Form.Submit>Uppdatera retreat</Form.Submit>
      </Form.ActionRow>
    </Form.Form>
  );
};

export const EDIT_RETREAT_FRAGMENT = gql`
  fragment EditRetreatMetadataFields on RetreatMetadata {
    id
    slug
    content
    startDate
    endDate
    maxParticipants
  }

  fragment EditRetreatFields on Retreat {
    id
    name
    description
  }
`;

export const UPDATE_RETREAT_MUTATION: TypedDocumentNode<UpdateRetreatMutation, UpdateRetreatMutationVariables> = gql`
  mutation UpdateRetreat(
    $retreatId: ID!
    $retreat: UpdateRetreatInput!
    $metadataId: ID!
    $metadata: UpdateRetreatMetadataInput!
  ) {
    updateRetreat(id: $retreatId, input: $retreat) {
      ...EditRetreatFields
    }
    updateRetreatMetadata(id: $metadataId, input: $metadata) {
      ...EditRetreatMetadataFields
    }
  }

  ${EDIT_RETREAT_FRAGMENT}
`;
