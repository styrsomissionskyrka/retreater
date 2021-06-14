import { SubmitHandler } from 'react-hook-form';

import { EditRetreatMetadataFieldsFragment, gql, TypedDocumentNode, useMutation } from 'lib/graphql';
import {
  UpdateRetreatMetadataInput,
  UpdateRetreatMetadataMutation,
  UpdateRetreatMetadataMutationVariables,
} from 'lib/graphql';
import { ConnectedForm, toast } from 'lib/components';

interface EditRetreatMetadataProps {
  metadata: EditRetreatMetadataFieldsFragment;
}

const Form = ConnectedForm.createConnectedFormComponents<UpdateRetreatMetadataInput>();

export const EditRetreatMetadata: React.FC<EditRetreatMetadataProps> = ({ metadata }) => {
  const [mutate] = useMutation(UPDATE_RETREAT_METADATA_MUTATION);

  const onSubmit: SubmitHandler<UpdateRetreatMetadataInput> = async (input) => {
    await toast.promise(mutate({ variables: { id: metadata.id, input } }), {
      loading: '...',
      success: 'Retreaten har uppdaterats.',
      error: 'Något gick snett.',
    });
  };

  return (
    <Form.Form onSubmit={onSubmit}>
      <Form.Row>
        <Form.Input name="startDate" type="date" label="Startdatum" required defaultValue={metadata.startDate ?? ''} />
        <Form.Input name="endDate" type="date" label="Slutdatum" required defaultValue={metadata.endDate ?? ''} />
      </Form.Row>
      <Form.Input
        name="maxParticipants"
        type="number"
        label="Max antal deltagare"
        defaultValue={metadata.maxParticipants ?? 10}
        required
        options={{ min: 0, max: 100 }}
      />
      <Form.Markdown name="content" label="Beskrivning" defaultValue={metadata.content ?? ''} />

      <Form.ActionRow>
        <Form.Submit>Uppdatera retreat</Form.Submit>
      </Form.ActionRow>
    </Form.Form>
  );
};

export const EDIT_RETREAT_METADATA_FRAGMENT = gql`
  fragment EditRetreatMetadataFields on RetreatMetadata {
    id
    slug
    content
    startDate
    endDate
    maxParticipants
  }
`;

export const UPDATE_RETREAT_METADATA_MUTATION: TypedDocumentNode<
  UpdateRetreatMetadataMutation,
  UpdateRetreatMetadataMutationVariables
> = gql`
  mutation UpdateRetreatMetadata($id: ID!, $input: UpdateRetreatMetadataInput!) {
    updateRetreatMetadata(id: $id, input: $input) {
      ...EditRetreatMetadataFields
    }
  }

  ${EDIT_RETREAT_METADATA_FRAGMENT}
`;
