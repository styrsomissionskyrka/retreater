import Stripe from 'stripe';
import { OrderStatus } from '@prisma/client';

import { assert } from 'lib/utils/assert';
import { prisma } from 'api/context/prisma';
import { createLogger, OrderEvent } from 'api/logs';

const log = createLogger(prisma);

export async function handleStripeEvents(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.client_reference_id;
      assert(orderId != null, 'Encountered a checkout session without order id.');

      let order = await prisma.order.findUnique({ where: { id: orderId }, select: { status: true } });
      let expectedStatus: OrderStatus[] = [OrderStatus.PENDING];
      let nextStatus = expectedStatus.includes(order?.status ?? OrderStatus.ERRORED)
        ? OrderStatus.CONFIRMED
        : OrderStatus.ERRORED;

      await prisma.order.update({
        where: { id: orderId },
        data: { status: nextStatus },
      });

      await Promise.all([
        log.order(orderId, OrderEvent.ORDER_CHECKOUT_COMPLETED),
        log.order(orderId, OrderEvent.ORDER_STATUS_UPDATED),
      ]);
      break;
  }
}
