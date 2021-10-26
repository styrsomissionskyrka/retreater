import { useState, Fragment } from 'react';
import { SubmitHandler } from 'react-hook-form';

import {
  gql,
  useMutation,
  TypedDocumentNode,
  AdminCreateOrderMutation,
  AdminCreateOrderMutationVariables,
  CreateOrderInput,
} from 'lib/graphql';

import { createConnectedFormComponents } from '../ConnectedForm';
import { Button } from '../Button';
import { Dialog, Title } from '../Dialog';
import { toast } from '../Toast';

type FormValues = AdminCreateOrderMutationVariables['input'] & { force: boolean };
const Form = createConnectedFormComponents<FormValues>();

interface CreateBookingProps {
  retreatId: string;
}

export const CreateBooking: React.FC<CreateBookingProps> = ({ retreatId }) => {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <Fragment>
      <Button onClick={() => setIsOpen(true)}>Ny bokning</Button>
      <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <Title>Skapa bokning</Title>
        <Form.Form onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Input name="name" label="Namn" defaultValue="" required />
            <Form.Input name="email" label="E-post" type="email" defaultValue="" required />
          </Form.Row>
          <Form.Row>
            <Form.PriceDropdown retreatId={retreatId} name="price" label="Pris" required defaultValue="" />
            <Form.PriceInput name="discount" label="Rabatt" currency="sek" defaultValue={0} />
          </Form.Row>

          <Form.Row>
            <Form.Checkbox
              name="force"
              defaultChecked={false}
              label="Skapa bokning även om alla platser redan är fyllda."
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

const CREATE_ORDER: TypedDocumentNode<AdminCreateOrderMutation, AdminCreateOrderMutationVariables> = gql`
  mutation AdminCreateOrder($input: CreateOrderInput!, $force: Boolean!) {
    createOrder(input: $input, force: $force) {
      id
    }
  }
`;
