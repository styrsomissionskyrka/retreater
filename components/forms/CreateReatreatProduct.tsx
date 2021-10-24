import { Fragment, useState } from 'react';
import { IconPlus } from '@tabler/icons';
import { SubmitHandler } from 'react-hook-form';

import {
  gql,
  TypedDocumentNode,
  useMutation,
  CreateRetreatProductMutation,
  CreateRetreatProductMutationVariables,
  CreateProductInput,
} from 'lib/graphql';

import { Button } from '../Button';
import * as ConnectedForm from '../ConnectedForm';
import { Dialog, Title } from '../Dialog';
import { toast } from '../Toast';

export const CREATE_RETREAT_PRODUCT_MUTATION: TypedDocumentNode<
  CreateRetreatProductMutation,
  CreateRetreatProductMutationVariables
> = gql`
  mutation CreateRetreatProduct($retreatId: ID!, $input: CreateProductInput!) {
    createProduct(input: $input, retreatId: $retreatId) {
      id
      active
      name
      description
    }
  }
`;

const Form = ConnectedForm.createConnectedFormComponents<CreateProductInput>();

export const CreateReatreatProduct: React.FC<{ retreatId: string }> = ({ retreatId }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [createRetreatProduct] = useMutation(CREATE_RETREAT_PRODUCT_MUTATION, {
    refetchQueries: ['EditRetreatForm'],
  });

  const handleSubmit: SubmitHandler<CreateProductInput> = async (input) => {
    await toast.promise(createRetreatProduct({ variables: { retreatId, input } }), {
      loading: '...',
      success: 'Ny variant skapat.',
      error: 'Det gick inte att skapa en variant.',
    });
    setShowDialog(false);
  };

  return (
    <Fragment>
      <Button iconStart={<IconPlus size={16} />} onClick={() => setShowDialog(true)}>
        Ny variant
      </Button>
      <Dialog isOpen={showDialog} onDismiss={() => setShowDialog(false)}>
        <Title>Skapa variant</Title>
        <Form.Form onSubmit={handleSubmit}>
          <Form.Input name="name" defaultValue="" label="Titel" required />
          <Form.ActionRow>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Avbryt
            </Button>
            <Form.Submit>Skapa variant</Form.Submit>
          </Form.ActionRow>
        </Form.Form>
      </Dialog>
    </Fragment>
  );
};
