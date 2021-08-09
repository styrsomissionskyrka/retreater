import * as path from 'path';

import Stripe from 'stripe';
import * as n from 'nexus';
import { UserInputError } from 'apollo-server-micro';

import { ignoreNull, stripeTimestampToMs, ensureArrayOfIds, authorizedWithRoles } from '../utils';

const refundStatusMembers = ['pending', 'succeeded', 'failed', 'canceled'] as const;
type RefundStatusMember = typeof refundStatusMembers[number];
function isRefundStatusEnum(value: any): value is RefundStatusMember {
  return refundStatusMembers.includes(value);
}

export const RefundStatusEnum = n.enumType({
  name: 'RefundStatusEnum',
  members: refundStatusMembers,
});

const refundReasonMembers: Stripe.RefundCreateParams.Reason[] = ['duplicate', 'fraudulent', 'requested_by_customer'];
export const RefundReasonEnum = n.enumType({
  name: 'RefundReasonEnum',
  members: refundReasonMembers,
});

export const Refund = n.objectType({
  name: 'Refund',
  sourceType: {
    module: path.join(process.cwd(), 'api/source-types.ts'),
    export: 'StripeRefund',
  },
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.date('created', { resolve: (source) => stripeTimestampToMs(source.created) });
    t.nonNull.int('amount');
    t.nonNull.string('currency');
    t.nonNull.field('status', {
      type: RefundStatusEnum,
      resolve(source) {
        if (isRefundStatusEnum(source.status)) return source.status;
        throw new Error(`Bad refund status found: ${source.status}`);
      },
    });
    t.string('reason');
  },
});

export const RefundMutation = n.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createRefund', {
      type: n.nonNull(Refund),
      authorize: authorizedWithRoles(['admin', 'superadmin']),
      args: {
        order: n.nonNull(n.idArg()),
        paymentIntent: n.nonNull(n.idArg()),
        amount: n.intArg(),
        reason: n.arg({ type: RefundReasonEnum }),
      },
      async resolve(_, args, ctx) {
        const order = await ctx.prisma.order.findUnique({ where: { id: args.order } });
        const paymentIntent = await ctx.stripe.paymentIntents.retrieve(args.paymentIntent);

        if (order == null) {
          throw new UserInputError(`Order with id ${args.order} could not be found.`);
        }

        const refund = await ctx.stripe.refunds.create({
          payment_intent: paymentIntent.id,
          amount: ignoreNull(args.amount),
          reason: ignoreNull(args.reason),
        });

        await ctx.prisma.order.update({
          where: { id: order.id },
          data: { refunds: [...ensureArrayOfIds(order.refunds), refund.id] },
        });

        return refund;
      },
    });
  },
});
