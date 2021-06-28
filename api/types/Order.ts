import * as n from 'nexus';
import { Order as PrismaOrder, OrderState } from '@prisma/client';
import { UserInputError } from 'apollo-server-micro';

import { assert } from '../../lib/utils/assert';
import { ensureArrayOfIds, ignoreNull } from '../utils';
import { Price, Retreat, CheckoutSession, Refund } from '.';

export const OrderStateEnum = n.enumType({
  name: 'OrderStateEnum',
  members: OrderState,
});

export const Order = n.objectType({
  name: 'Order',
  sourceType: {
    module: '@prisma/client',
    export: 'Order',
  },
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');

    t.nonNull.field('state', { type: OrderStateEnum });

    t.nonNull.field('price', {
      type: Price,
      resolve: (source, _, ctx) => ctx.stripe.prices.retrieve(source.price),
    });

    t.nonNull.list.nonNull.field('checkoutSessions', {
      type: CheckoutSession,
      async resolve(source, _, ctx) {
        let ids = ensureArrayOfIds(source.checkoutSessions);
        return Promise.all(ids.map((id) => ctx.stripe.checkout.sessions.retrieve(id)));
      },
    });

    t.nonNull.list.nonNull.field('refunds', {
      type: Refund,
      async resolve(source, _, ctx) {
        let ids = ensureArrayOfIds(source.checkoutSessions);
        let sessions = await Promise.all(ids.map((id) => ctx.stripe.checkout.sessions.retrieve(id)));
        let paymentIntents = sessions
          .map((session) => session.payment_intent)
          .filter((id): id is string => typeof id === 'string');

        let refunds = (
          await Promise.all(
            paymentIntents.map(async (id) => {
              let response = await ctx.stripe.refunds.list({ payment_intent: id });
              return response.data;
            }),
          )
        ).flat();

        return refunds;
      },
    });

    t.nonNull.string('name');
    t.nonNull.string('email');

    t.nonNull.field('retreat', {
      type: Retreat,
      async resolve(source, _, ctx) {
        let id = source.retreatId;
        let retreat = await ctx.prisma.retreat.findUnique({ where: { id } });
        if (retreat == null) throw new Error('No retreat found related to order.');
        return retreat;
      },
    });
  },
});

export const OrderCheckoutSession = n.objectType({
  name: 'OrderCheckoutSession',
  definition(t) {
    t.nonNull.field('order', { type: Order });
    t.nonNull.field('checkoutSession', { type: CheckoutSession });
  },
});

export const OrderQuery = n.extendType({
  type: 'Query',
  definition(t) {
    t.field('order', {
      type: Order,
      args: { id: n.nonNull(n.idArg()) },
      resolve(_, args, ctx) {
        return ctx.prisma.order.findUnique({ where: { id: args.id } });
      },
    });
  },
});

export const RetreatWithOrders = n.extendType({
  type: 'Retreat',
  definition(t) {
    t.field('orders', {
      type: n.list(n.nonNull(Order)),
      args: { status: n.arg({ type: OrderStateEnum }) },
      resolve(source, args, ctx) {
        return ctx.prisma.order.findMany({
          where: { retreatId: source.id, state: ignoreNull(args.status) },
        });
      },
    });
  },
});

export const OrderMutation = n.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createOrder', {
      type: n.nonNull(Order),
      args: { input: n.nonNull(n.arg({ type: CreateOrderInput })) },
      resolve(_, args, ctx) {
        return ctx.prisma.order.create({
          data: {
            ...args.input,
            state: OrderState.CREATED,
            checkoutSessions: [],
          },
        });
      },
    });

    t.field('checkoutOrder', {
      type: n.nonNull(OrderCheckoutSession),
      args: { id: n.nonNull(n.idArg()) },
      async resolve(_, args, ctx) {
        let order = await ctx.prisma.order.findUnique({ where: { id: args.id } });
        if (order == null) throw new UserInputError(`Order with id ${args.id} doesn't exists.`);

        const acceptedStates: OrderState[] = ['CREATED'];
        if (!acceptedStates.includes(order.state)) {
          throw new UserInputError(`An order in "${order.state}" state can not proceed to checkout.`);
        }

        const checkoutSession = await ctx.stripe.checkout.sessions.create({
          mode: 'payment',
          payment_method_types: ['card'],
          client_reference_id: order.id,
          customer_email: order.email,
          line_items: [{ price: order.price, quantity: 1 }],
          success_url:
            new URL('/checkout/success', process.env.VERCEL_URL).toString() + '?session_id={CHECKOUT_SESSION_ID}',
          cancel_url:
            new URL('/checkout/cancel', process.env.VERCEL_URL).toString() + '?session_id={CHECKOUT_SESSION_ID}',
        });

        let nextCheckoutSessions = [...ensureArrayOfIds(order.checkoutSessions), checkoutSession.id];
        order = await ctx.prisma.order.update({
          where: { id: order.id },
          data: { state: OrderState.PENDING, checkoutSessions: nextCheckoutSessions },
        });

        return { order, checkoutSession };
      },
    });

    t.field('cancelOrder', {
      type: Order,
      args: { sessionId: n.idArg(), id: n.idArg() },
      async resolve(_, args, ctx) {
        let orderId: string | null = args.id ?? null;
        if (args.sessionId != null) {
          let session = await ctx.stripe.checkout.sessions.retrieve(args.sessionId);
          assert(session.client_reference_id != null, 'Encountered session without order reference.');
          orderId = session.client_reference_id;
        }

        if (orderId == null) return null;

        let order = await ctx.prisma.order.update({ where: { id: orderId }, data: { state: OrderState.CANCELLED } });
        return order;
      },
    });
  },
});

export const CreateOrderInput = n.inputObjectType({
  name: 'CreateOrderInput',
  definition(t) {
    t.nonNull.id('retreatId');
    t.nonNull.id('price');
    t.nonNull.string('name');
    t.nonNull.string('email');
  },
});
