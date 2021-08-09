import * as n from 'nexus';
import { OrderStatus, Prisma } from '@prisma/client';
import { UserInputError } from 'apollo-server-micro';

import { assert } from '../../lib/utils/assert';
import { ignoreNull, isRetreatOrderable, createPaginationMeta, authorizedWithRoles } from '../utils';
import { Price, Retreat, CheckoutSession, Refund, Coupon } from '.';
import { OrderEnum, PaginatedQuery } from './Shared';

export const OrderStatusEnum = n.enumType({
  name: 'OrderStatusEnum',
  members: OrderStatus,
});

export const OrderOrderByEnum = n.enumType({
  name: 'OrderOrderByEnum',
  members: {
    CREATED_AT: 'createdAt',
    STATUS: 'status',
  },
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
    t.date('confirmedAt');
    t.date('cancelledAt');

    t.nonNull.field('status', { type: OrderStatusEnum });

    t.nonNull.field('price', {
      type: Price,
      resolve: (source, _, ctx) => ctx.stripe.prices.retrieve(source.price),
    });

    t.field('coupon', {
      type: Coupon,
      resolve(source, _, ctx) {
        if (source.coupon == null) return null;
        return ctx.stripe.coupons.retrieve(source.coupon);
      },
    });

    t.nonNull.list.nonNull.field('checkoutSessions', {
      type: CheckoutSession,
      async resolve(source, _, ctx) {
        let ids = source.checkoutSessions;
        return Promise.all(ids.map((id) => ctx.stripe.checkout.sessions.retrieve(id)));
      },
    });

    t.nonNull.list.nonNull.field('refunds', {
      type: Refund,
      async resolve(source, _, ctx) {
        let ids = source.checkoutSessions;
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

export const PaginatedOrder = n.objectType({
  name: 'PaginatedOrder',
  definition(t) {
    t.implements(PaginatedQuery);
    t.nonNull.list.nonNull.field('items', { type: Order });
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
      authorize: authorizedWithRoles(['admin', 'superadmin']),
      args: { id: n.nonNull(n.idArg()) },
      resolve(_, args, ctx) {
        return ctx.prisma.order.findUnique({ where: { id: args.id } });
      },
    });

    t.field('orders', {
      type: n.nonNull(PaginatedOrder),
      authorize: authorizedWithRoles(['admin', 'superadmin']),
      args: {
        page: n.nonNull(n.intArg({ default: 1 })),
        perPage: n.nonNull(n.intArg({ default: 25 })),
        order: n.nonNull(n.arg({ type: OrderEnum, default: 'asc' })),
        orderBy: n.nonNull(n.arg({ type: OrderOrderByEnum, default: 'createdAt' })),
        status: n.arg({ type: OrderStatusEnum, default: OrderStatus.CONFIRMED }),
        retreatId: n.idArg(),
        search: n.stringArg(),
      },
      async resolve(_, args, ctx) {
        let skip = args.perPage * (args.page - 1);
        let take = args.perPage;

        let where: Prisma.OrderWhereInput = {
          status: ignoreNull(args.status),
          retreatId: ignoreNull(args.retreatId),
          email: args.search ? { contains: args.search } : undefined,
        };

        let orders = await ctx.prisma.order.findMany({
          take,
          skip,
          orderBy: { [args.orderBy]: args.order },
          where,
        });

        let total = await ctx.prisma.order.count({ where });
        let paginationMeta = createPaginationMeta(args.page, args.perPage, total);

        return { items: orders, paginationMeta };
      },
    });
  },
});

export const RetreatWithOrders = n.extendType({
  type: 'Retreat',
  definition(t) {
    t.field('orders', {
      type: n.list(n.nonNull(Order)),
      authorize: authorizedWithRoles(['admin', 'superadmin']),
      args: { status: n.arg({ type: OrderStatusEnum }) },
      resolve(source, args, ctx) {
        return ctx.prisma.order.findMany({
          where: { retreatId: source.id, status: ignoreNull(args.status) },
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
      args: {
        input: n.nonNull(n.arg({ type: CreateOrderInput })),
        force: n.booleanArg({
          description: 'Signed in users can force order creation even if max participants is reached.',
        }),
      },
      authorize(source, args, ctx) {
        if (args.force === true || args.input.discount != null) {
          let authorize = authorizedWithRoles(['admin', 'superadmin']);
          return authorize(source, args, ctx);
        }

        return true;
      },
      async resolve(_, args, ctx) {
        let retreat = await ctx.prisma.retreat.findUnique({ where: { id: args.input.retreatId } });

        let canPlaceOrder = args.force ? true : await isRetreatOrderable(retreat, ctx);
        if (!canPlaceOrder) {
          throw new UserInputError(`Can't place order on retreat with id ${args.input.retreatId}.`);
        }

        let couponId: string | undefined = undefined;
        if (args.input.discount != null) {
          let price = await ctx.stripe.prices.retrieve(args.input.price);
          let coupon = await ctx.stripe.coupons.create({
            amount_off: args.input.discount,
            currency: price.currency,
            duration: 'once',
            name: 'Rabatt',
            applies_to: {
              products: [typeof price.product === 'string' ? price.product : price.product.id],
            },
          });

          couponId = coupon.id;
        }

        return ctx.prisma.order.create({
          data: {
            retreatId: args.input.retreatId,
            price: args.input.price,
            name: args.input.name,
            email: args.input.email,
            status: OrderStatus.CREATED,
            coupon: couponId,
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

        const acceptedStatus: OrderStatus[] = ['CREATED'];
        if (!acceptedStatus.includes(order.status)) {
          throw new UserInputError(`An order in "${order.status}" state can not proceed to checkout.`);
        }

        const checkoutSession = await ctx.stripe.checkout.sessions.create({
          mode: 'payment',
          payment_method_types: ['card'],
          client_reference_id: order.id,
          customer_email: order.email,
          line_items: [{ price: order.price, quantity: 1 }],
          discounts: order.coupon != null ? [{ coupon: order.coupon }] : undefined,
          success_url:
            new URL('/checkout/success', process.env.VERCEL_URL).toString() + '?session_id={CHECKOUT_SESSION_ID}',
          cancel_url:
            new URL('/checkout/cancel', process.env.VERCEL_URL).toString() + '?session_id={CHECKOUT_SESSION_ID}',
        });

        let nextCheckoutSessions = [...order.checkoutSessions, checkoutSession.id];
        order = await ctx.prisma.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.PENDING, checkoutSessions: nextCheckoutSessions },
        });

        return { order, checkoutSession };
      },
    });

    t.field('cancelOrder', {
      type: Order,
      args: { sessionId: n.idArg(), id: n.idArg() },
      authorize: authorizedWithRoles(['admin', 'superadmin']),
      async resolve(_, args, ctx) {
        let orderId: string | null = args.id ?? null;
        if (args.sessionId != null) {
          let session = await ctx.stripe.checkout.sessions.retrieve(args.sessionId);
          assert(session.client_reference_id != null, 'Encountered session without order reference.');
          orderId = session.client_reference_id;
        }

        if (orderId == null) return null;

        let order = await ctx.prisma.order.update({ where: { id: orderId }, data: { status: OrderStatus.CANCELLED } });
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
    t.int('discount', {
      description: 'Optional discount for this specific order. Can only be applied by signed in users. In cents.',
    });
  },
});
