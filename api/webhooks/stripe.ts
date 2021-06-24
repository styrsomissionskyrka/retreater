import Stripe from 'stripe';
import { OrderState } from '@prisma/client';

import { assert } from 'lib/utils/assert';
import { prisma } from 'api/context/prisma';

export async function handleStripeEvents(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.client_reference_id;
      assert(orderId != null, 'Encountered a checkout session without order id.');

      let order = await prisma.order.findUnique({ where: { id: orderId }, select: { state: true } });
      let expectedStates: OrderState[] = [OrderState.PENDING];
      let nextState = expectedStates.includes(order?.state ?? OrderState.ERRORED)
        ? OrderState.CONFIRMED
        : OrderState.ERRORED;

      await prisma.order.update({
        where: { id: orderId },
        data: { state: nextState },
      });
      break;
  }
}
