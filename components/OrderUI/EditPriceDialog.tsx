import { Fragment, useState } from 'react';
import { IconEdit } from '@tabler/icons';
import { SubmitHandler } from 'react-hook-form';

import {
  gql,
  useMutation,
  TypedDocumentNode,
  EditOrderPriceDataQuery,
  EditOrderPriceDataQueryVariables,
  EditOrderPriceMutation,
  EditOrderPriceMutationVariables,
  useQuery,
} from 'lib/graphql';

import { Button } from '../Button';
import { Dialog, Title } from '../Dialog';
import * as ConnectedForm from '../ConnectedForm';
import { Spinner } from '../Spinner';
import { toast } from '../Toast';

type FormValues = { price: string; discount: number };
const Form = ConnectedForm.createConnectedFormComponents<FormValues>();

export const EditPriceDialog: React.FC<{ id: string }> = ({ id }) => {
  const [showDialog, setShowDialog] = useState(false);
  const { data } = useQuery(EDIT_ORDER_PRICE_DATA, { variables: { id } });
  const [mutation] = useMutation(EDIT_ORDER_PRICE_MUTATION);

  let handleSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      await toast.promise(mutation({ variables: { id, input: values } }), {
        loading: '...',
        success: 'Pris uppdaterat',
        error: 'Kunde inte uppdatera priset',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setShowDialog(false);
    }
  };

  return (
    <Fragment>
      <Button
        size="small"
        iconStart={<IconEdit size={16} />}
        variant="default"
        onClick={() => setShowDialog(!showDialog)}
      >
        Redigera pris
      </Button>

      <Dialog isOpen={showDialog} onDismiss={() => setShowDialog(false)}>
        <Title>Skapa retreat</Title>
        {data?.order == null ? (
          <Spinner />
        ) : (
          <Form.Form onSubmit={handleSubmit}>
            <Form.Row>
              <Form.PriceDropdown name="price" defaultValue={data.order.price.id} retreatId={data.order.retreat.id} />
              <Form.PriceInput
                name="discount"
                defaultValue={data.order.coupon?.amountOff ?? ''}
                currency={data.order.price.currency}
              />
            </Form.Row>

            <Form.ActionRow>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Avbryt
              </Button>
              <Form.Submit>Uppdatera pris</Form.Submit>
            </Form.ActionRow>
          </Form.Form>
        )}
      </Dialog>
    </Fragment>
  );
};

export const EDIT_ORDER_PRICE_DATA: TypedDocumentNode<EditOrderPriceDataQuery, EditOrderPriceDataQueryVariables> = gql`
  query EditOrderPriceData($id: ID!) {
    order(id: $id) {
      id
      retreat {
        id
      }
      price {
        id
        currency
      }
      coupon {
        id
        amountOff
      }
    }
  }
`;

export const EDIT_ORDER_PRICE_MUTATION: TypedDocumentNode<
  EditOrderPriceMutation,
  EditOrderPriceMutationVariables
> = gql`
  mutation EditOrderPrice($id: ID!, $input: UpdateOrderPriceInput!) {
    updateOrderPrice(id: $id, input: $input) {
      id
      price {
        id
        amount
      }
      coupon {
        id
        amountOff
        currency
        created
      }
    }
  }
`;
