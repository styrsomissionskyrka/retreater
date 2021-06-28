import { NextPage } from 'next';

import {
  gql,
  useQuery,
  TypedDocumentNode,
  IndexListRetreatsQuery,
  CreateOrderMutation,
  CreateOrderMutationVariables,
  CheckoutOrderMutation,
  CheckoutOrderMutationVariables,
  useMutation,
} from 'lib/graphql';
import { Link } from 'lib/components';
import { usePreloadStripe, getStripe } from 'lib/stripe';
import { assert } from 'lib/utils/assert';

const Home: NextPage = () => {
  usePreloadStripe();

  const { data } = useQuery(INDEX_LIST_RETREATS);
  const [createOrder, { loading: creatingOrder }] = useMutation(CREATE_ORDER);
  const [checkoutOrder, { loading: checkingOutOrder }] = useMutation(CHECKOUT_ORDER);

  const retreats = data?.retreats.items ?? [];

  const handleCheckout = async (retreatId: string, price: string) => {
    try {
      let { data: createOrderData, errors } = await createOrder({
        variables: {
          input: {
            retreatId,
            price,
            name: 'Adam Bergman',
            email: 'adam@fransvilhelm.com',
          },
        },
      });

      if (errors) console.error(errors);
      assert(createOrderData != null, 'Failed to create order');

      let id = createOrderData.createOrder.id;
      let { data: checkoutOrderData } = await checkoutOrder({ variables: { id } });
      assert(checkoutOrderData != null, 'Failed to create order checkout.');

      let stripe = await getStripe();
      let { error } = await stripe.redirectToCheckout({
        sessionId: checkoutOrderData.checkoutOrder.checkoutSession.id,
      });
      console.log(error);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header>
      <h1>Styrsö Missionskyrka | Retreater</h1>
      <Link href="/admin">Admin</Link>
      <div className="mt-10">
        <ul className="space-y-8">
          {retreats.map((retreat) => (
            <li key={retreat.id}>
              <h2>
                {retreat.title} {retreat.canPlaceOrder ? '' : 'fullbokad'}
              </h2>
              {retreat.canPlaceOrder ? (
                <ul>
                  {retreat.products.map((product) => {
                    let price = product.prices[0];
                    if (price == null) return null;

                    return (
                      <li key={product.id}>
                        <p>{product.name}</p>
                        <button
                          type="button"
                          disabled={creatingOrder || checkingOutOrder}
                          onClick={() => handleCheckout(retreat.id, price.id)}
                        >
                          Boka
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
              <hr />
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Home;

const INDEX_LIST_RETREATS: TypedDocumentNode<IndexListRetreatsQuery> = gql`
  query IndexListRetreats {
    retreats(page: 1, perPage: 10, status: PUBLISHED) {
      items {
        id
        title
        canPlaceOrder
        products {
          id
          name
          prices(active: true) {
            id
          }
        }
      }
    }
  }
`;

const ORDER_FRAGMENT = gql`
  fragment OrderFragment on Order {
    id
    status
  }
`;

const CREATE_ORDER: TypedDocumentNode<CreateOrderMutation, CreateOrderMutationVariables> = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ...OrderFragment
    }
  }

  ${ORDER_FRAGMENT}
`;

const CHECKOUT_ORDER: TypedDocumentNode<CheckoutOrderMutation, CheckoutOrderMutationVariables> = gql`
  mutation CheckoutOrder($id: ID!) {
    checkoutOrder(id: $id) {
      order {
        ...OrderFragment
      }
      checkoutSession {
        id
      }
    }
  }

  ${ORDER_FRAGMENT}
`;
