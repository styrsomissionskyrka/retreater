import { useState, Fragment } from 'react';
import { SubmitHandler } from 'react-hook-form';

import {
  gql,
  useQuery,
  useMutation,
  TypedDocumentNode,
  AdminRetreatPricesQuery,
  AdminRetreatPricesQueryVariables,
  AdminCreateOrderMutation,
  AdminCreateOrderMutationVariables,
  CreateOrderInput,
} from 'lib/graphql';
import { Button, Dialog, toast } from 'components';
import { createConnectedFormComponents } from 'components/ConnectedForm';
import { formatMoney } from 'lib/utils/money';

type FormValues = AdminCreateOrderMutationVariables['input'] & { force: boolean };
const Form = createConnectedFormComponents<FormValues>();

interface CreateBookingProps {
  retreatId: string;
}

export const CreateBooking: React.FC<CreateBookingProps> = ({ retreatId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useQuery(RETREAT_PRICES, { variables: { id: retreatId }, skip: !isOpen });
  const [createOrder] = useMutation(CREATE_ORDER, { refetchQueries: ['ListAdminOrders'] });

  const handleSubmit: SubmitHandler<FormValues> = async (values) => {
    let input: CreateOrderInput = {
      retreatId,
      price: values.price,
      name: values.name,
      email: values.email,
    };

    if (values.discount != null && values.discount > 0) {
      input.discount = values.discount;
    }

    try {
      await toast.promise(createOrder({ variables: { input, force: values.force } }), {
        loading: '...',
        success: 'Ny bokning skapad',
        error: 'Kunde inte skapa ny bokning',
      });
    } catch (error) {
      console.error(error);
    }
  };

  let priceOptions = data?.retreat?.products.flatMap((product) =>
    product.prices.map((price) => ({
      value: price.id,
      label: `${product.name}, ${formatMoney(price.amount, price.currency)}`,
    })),
  );

  return (
    <Fragment>
      <Button onClick={() => setIsOpen(true)}>Ny bokning</Button>
      <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <h2 className="text-xl font-medium mb-8 text-center">Skapa bokning</h2>
        <Form.Form onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Input name="name" label="Namn" defaultValue="" required />
            <Form.Input name="email" label="E-post" type="email" defaultValue="" required />
          </Form.Row>
          <Form.Row>
            {priceOptions != null ? (
              <Fragment>
                <Form.Select name="price" label="Pris" required defaultValue={priceOptions[0]?.value}>
                  {priceOptions.map((price) => (
                    <option key={price.value} value={price.value}>
                      {price.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.PriceInput name="discount" label="Rabatt" currency="sek" defaultValue={0} />
              </Fragment>
            ) : null}
          </Form.Row>

          <Form.Row>
            <Form.Checkbox
              name="force"
              defaultChecked={false}
              label="Skapa order även om alla platser redan är fyllda."
            />
          </Form.Row>

          <Form.ActionRow>
            <Form.Submit>Skapa bokning</Form.Submit>
          </Form.ActionRow>
        </Form.Form>
      </Dialog>
    </Fragment>
  );
};

const RETREAT_PRICES: TypedDocumentNode<AdminRetreatPricesQuery, AdminRetreatPricesQueryVariables> = gql`
  query AdminRetreatPrices($id: ID!) {
    retreat(id: $id) {
      id
      products(active: true) {
        id
        name
        prices(active: true) {
          id
          amount
          currency
        }
      }
    }
  }
`;

const CREATE_ORDER: TypedDocumentNode<AdminCreateOrderMutation, AdminCreateOrderMutationVariables> = gql`
  mutation AdminCreateOrder($input: CreateOrderInput!, $force: Boolean!) {
    createOrder(input: $input, force: $force) {
      id
    }
  }
`;
