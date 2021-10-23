import { Fragment, useState } from 'react';
import { IconPlus } from '@tabler/icons';
import { SubmitHandler } from 'react-hook-form';

import {
  gql,
  TypedDocumentNode,
  useMutation,
  CreateProductPriceMutation,
  CreateProductPriceMutationVariables,
  CreatePriceInput,
} from 'lib/graphql';
import { toCents } from 'lib/utils/money';

import { Button } from '../Button';
import * as ConnectedForm from '../ConnectedForm';
import { Dialog } from '../Dialog';
import { toast } from '../Toast';

export const CREATE_PRICE_MUTATION: TypedDocumentNode<
  CreateProductPriceMutation,
  CreateProductPriceMutationVariables
> = gql`
  mutation CreateProductPrice($productId: ID!, $input: CreatePriceInput!) {
    createPrice(productId: $productId, input: $input) {
      id
      active
      amount
      currency
    }
  }
`;

type FormValues = Pick<CreatePriceInput, 'amount' | 'nickname'>;
const Form = ConnectedForm.createConnectedFormComponents<FormValues>();

export const CreateProductPrice: React.FC<{ productId: string }> = ({ productId }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [createPrice] = useMutation(CREATE_PRICE_MUTATION, { refetchQueries: ['EditRetreatForm'] });

  const handleSubmit: SubmitHandler<FormValues> = async (input) => {
    await toast.promise(
      createPrice({ variables: { productId, input: { currency: 'SEK', amount: toCents(input.amount) } } }),
      {
        loading: '...',
        success: 'Nytt pris skapat.',
        error: 'Kunde inte skapa pris.',
      },
    );
    setShowDialog(false);
  };

  return (
    <Fragment>
      <Button size="small" variant="outline" iconStart={<IconPlus size={16} />} onClick={() => setShowDialog(true)}>
        Nytt pris
      </Button>
      <Dialog isOpen={showDialog} onDismiss={() => setShowDialog(false)}>
        <h2 className="text-xl font-medium mb-8 text-center">Skapa variant</h2>
        <Form.Form onSubmit={handleSubmit}>
          <Form.Input type="number" name="amount" defaultValue="" label="Värde" required suffix="SEK" />
          <Form.Input name="nickname" defaultValue="" label="Namn (internt)" />
          <Form.ActionRow>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Avbryt
            </Button>
            <Form.Submit>Skapa pris</Form.Submit>
          </Form.ActionRow>
        </Form.Form>
      </Dialog>
    </Fragment>
  );
};
