import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { gql, useMutation, TypedDocumentNode, CancelOrderMutation, CancelOrderMutationVariables } from 'lib/graphql';

const CheckoutCancel: NextPage = () => {
  const router = useRouter();
  const [cancelOrder, { called }] = useMutation(CANCEL_ORDER_MUTATION);

  useEffect(() => {
    if (called) return;
    let sessionId = router.query.session_id;
    if (typeof sessionId === 'string') cancelOrder({ variables: { sessionId } });
  }, [called, cancelOrder, router.query.session_id]);

  return <div>Din order har avbrutits.</div>;
};

export default CheckoutCancel;

const CANCEL_ORDER_MUTATION: TypedDocumentNode<CancelOrderMutation, CancelOrderMutationVariables> = gql`
  mutation CancelOrder($sessionId: ID) {
    cancelOrder(sessionId: $sessionId) {
      id
      state
    }
  }
`;
