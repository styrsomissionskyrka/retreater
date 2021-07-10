import * as path from 'path';

import * as n from 'nexus';

import { Price } from './Price';
import { stripeTimestampToMs } from '../utils';

export const CheckoutSessionStatusEnum = n.enumType({
  name: 'CheckoutSessionStatusEnum',
  members: { NO_PAYMENT_REQUIRED: 'no_payment_required', PAID: 'paid', UNPAID: 'unpaid' },
});

export const PaymentIntent = n.objectType({
  name: 'PaymentIntent',
  sourceType: {
    module: path.join(process.cwd(), 'api/source-types.ts'),
    export: 'StripePaymentIntent',
  },
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.int('amount');
    t.nonNull.string('currency');
    t.nonNull.date('created', { resolve: (source) => stripeTimestampToMs(source.created) });

    t.nonNull.int('refundable', {
      description: 'Total amount left to be refunded.',
      async resolve(source, _, ctx) {
        const refunds = await ctx.stripe.refunds.list({ payment_intent: source.id }).autoPagingToArray({ limit: 1000 });
        let total = refunds.reduce((acc, refund) => {
          return acc - refund.amount;
        }, source.amount);

        return total;
      },
    });
    t.nonNull.int('refunded', {
      description: 'Total amount refunded, in cents.',
      async resolve(source, _, ctx) {
        const refunds = await ctx.stripe.refunds.list({ payment_intent: source.id }).autoPagingToArray({ limit: 1000 });
        let total = refunds.reduce((acc, refund) => {
          return acc + refund.amount;
        }, 0);

        return total;
      },
    });
  },
});

export const LineItem = n.objectType({
  name: 'LineItem',
  sourceType: {
    module: path.join(process.cwd(), 'api/source-types.ts'),
    export: 'StripeLineItem',
  },
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.int('amountSubtotal', { resolve: (source) => source.amount_subtotal });
    t.nonNull.int('amountTotal', { resolve: (source) => source.amount_total });
    t.nonNull.string('currency');

    t.int('quantity', { resolve: (source) => source.quantity });

    t.string('description');
    t.field('price', { type: Price });
  },
});

export const CheckoutSession = n.objectType({
  name: 'CheckoutSession',
  sourceType: {
    module: path.join(process.cwd(), 'api/source-types.ts'),
    export: 'StripeCheckoutSession',
  },
  definition(t) {
    t.nonNull.id('id');

    t.int('amount', { resolve: (source) => source.amount_total });
    t.string('currency');
    t.string('customerEmail', { resolve: (source) => source.customer_email });
    t.nonNull.field('status', { type: CheckoutSessionStatusEnum, resolve: (source) => source.payment_status });

    t.field('paymentIntent', {
      type: PaymentIntent,
      async resolve(source, _, ctx) {
        let intent = source.payment_intent;
        if (typeof intent === 'string') intent = await ctx.stripe.paymentIntents.retrieve(intent);
        return intent;
      },
    });

    t.nonNull.list.nonNull.field('lineItems', {
      type: LineItem,
      async resolve(source, _, ctx) {
        return ctx.stripe.checkout.sessions.listLineItems(source.id).autoPagingToArray({ limit: 1000 });
      },
    });
  },
});

export const CheckoutSessionQuery = n.extendType({
  type: 'Query',
  definition(t) {
    t.field('paymentIntent', {
      type: n.nonNull(PaymentIntent),
      args: { id: n.nonNull(n.idArg()) },
      resolve(_, args, ctx) {
        return ctx.stripe.paymentIntents.retrieve(args.id);
      },
    });
  },
});
