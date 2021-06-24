import * as path from 'path';

import * as n from 'nexus';

import { Price } from './Price';

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
    t.field('description', { type: Price });
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

    t.int('amount');
    t.string('currency');
    t.string('customerEmail', { resolve: (source) => source.customer_email });

    t.field('paymentIntent', {
      type: PaymentIntent,
      async resolve(source, _, ctx) {
        if (typeof source.payment_intent === 'string') return ctx.stripe.paymentIntents.retrieve(source.payment_intent);
        return source.payment_intent;
      },
    });

    t.nonNull.list.nonNull.field('lineItems', {
      type: LineItem,
      async resolve(source, _, ctx) {
        let existing = source.line_items?.data;
        if (Array.isArray(existing)) return existing;
        let response = await ctx.stripe.checkout.sessions.listLineItems(source.id);
        return response.data;
      },
    });
  },
});
