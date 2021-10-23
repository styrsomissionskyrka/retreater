import { SubmitHandler } from 'react-hook-form';

import {
  CreateRefundMutation,
  CreateRefundMutationVariables,
  PaymentIntentRefundableQuery,
  PaymentIntentRefundableQueryVariables,
  gql,
  TypedDocumentNode,
  useMutation,
  useQuery,
} from 'lib/graphql';
import { formatMoney } from 'lib/utils/money';

import * as ConnectedForm from '../ConnectedForm';
import { Dialog } from '../Dialog';
import { toast } from '../Toast';

type FormValues = Pick<CreateRefundMutationVariables, 'amount'>;
const Form = ConnectedForm.createConnectedFormComponents<FormValues>();

interface CreateRefundProps {
  order: string;
  paymentIntent: string;
  currency: string;
  isOpen: boolean;
  onDismiss: () => void;
}

export const CreateRefund: React.FC<CreateRefundProps> = ({ order, paymentIntent, currency, isOpen, onDismiss }) => {
  const { data, loading } = useQuery(PAYMENT_INTENT_REFUNDABLE, { skip: !isOpen, variables: { id: paymentIntent } });
  const [createRefund] = useMutation(CREATE_REFUND, { refetchQueries: ['AdminOrderRefunds', 'AdminOrderPayments'] });

  const refundable = data?.paymentIntent.refundable ?? 0;

  const handleSubmit: SubmitHandler<FormValues> = async (values) => {
    let variables: CreateRefundMutationVariables = { order, paymentIntent };
    if (values.amount != null && values.amount !== refundable) {
      variables.amount = values.amount;
    }

    try {
      await toast.promise(createRefund({ variables }), {
        loading: '...',
        success: 'Återbetalning påbörjad',
        error: 'Kunde inte skapa återbetalning',
      });
      onDismiss();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog isOpen={isOpen} onDismiss={onDismiss}>
      {loading ? (
        <p>Laddar...</p>
      ) : (
        <Form.Form onSubmit={handleSubmit}>
          <Form.Row>
            <Form.PriceInput
              name="amount"
              label={`Summa (max ${formatMoney(refundable ?? 0, currency)})`}
              currency={currency}
              min={100}
              max={refundable}
              defaultValue={refundable}
            />
          </Form.Row>
          <Form.ActionRow>
            <Form.Submit>Skapa återbetalning</Form.Submit>
          </Form.ActionRow>
        </Form.Form>
      )}
    </Dialog>
  );
};

const PAYMENT_INTENT_REFUNDABLE: TypedDocumentNode<
  PaymentIntentRefundableQuery,
  PaymentIntentRefundableQueryVariables
> = gql`
  query PaymentIntentRefundable($id: ID!) {
    paymentIntent(id: $id) {
      id
      refundable
    }
  }
`;

const CREATE_REFUND: TypedDocumentNode<CreateRefundMutation, CreateRefundMutationVariables> = gql`
  mutation CreateRefund($order: ID!, $paymentIntent: ID!, $amount: Int) {
    createRefund(order: $order, paymentIntent: $paymentIntent, amount: $amount) {
      id
      created
      amount
      currency
      status
      reason
    }
  }
`;
