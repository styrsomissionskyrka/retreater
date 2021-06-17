import * as path from 'path';

import * as n from 'nexus';

import { ignoreNull, stripeTimestampToMs } from '../utils';

export const Price = n.objectType({
  name: 'Price',
  sourceType: {
    module: path.join(process.cwd(), 'api/source-types.ts'),
    export: 'StripePrice',
  },
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.boolean('active');
    t.nonNull.string('currency');
    t.string('nickname');
    t.nonNull.date('created', { resolve: (source) => stripeTimestampToMs(source.created) });
    t.nonNull.int('amount', { resolve: (source) => source.unit_amount ?? 0 });
  },
});

export const ProductWithPrice = n.extendType({
  type: 'Product',
  definition(t) {
    t.nonNull.list.nonNull.field('prices', {
      type: Price,
      args: { active: n.booleanArg() },
      async resolve(source, args, ctx) {
        let result = await ctx.stripe.prices.list({ product: source.id, active: ignoreNull(args.active) });
        let prices = result.data.filter((price) => !price.deleted);
        return prices;
      },
    });
  },
});

export const PriceMutation = n.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateProductPrice', {
      type: Price,
      args: {
        productId: n.nonNull(n.idArg()),
        input: n.nonNull(n.arg({ type: CreatePriceInput })),
      },
      async resolve(_, args, ctx) {
        let existingPrices = await ctx.stripe.prices.list({ product: args.productId, limit: 100, active: true });
        await Promise.all(existingPrices.data.map(({ id }) => ctx.stripe.prices.update(id, { active: false })));
        let newPrice = await ctx.stripe.prices.create({
          product: args.productId,
          currency: args.input.currency,
          unit_amount: args.input.amount,
          active: ignoreNull(args.input.active),
          nickname: ignoreNull(args.input.nickname),
        });

        return newPrice;
      },
    });

    t.field('createPrice', {
      type: Price,
      args: {
        productId: n.nonNull(n.idArg()),
        input: n.nonNull(n.arg({ type: CreatePriceInput })),
      },
      resolve(_, args, ctx) {
        return ctx.stripe.prices.create({
          product: args.productId,
          currency: args.input.currency,
          unit_amount: args.input.amount,
          active: ignoreNull(args.input.active),
          nickname: ignoreNull(args.input.nickname),
        });
      },
    });

    t.field('updatePrice', {
      type: Price,
      args: {
        id: n.nonNull(n.idArg()),
        input: n.nonNull(n.arg({ type: UpdatePriceInput })),
      },
      resolve(_, args, ctx) {
        return ctx.stripe.prices.update(args.id, {
          active: ignoreNull(args.input.active),
          nickname: ignoreNull(args.input.nickname),
        });
      },
    });
  },
});

export const CreatePriceInput = n.inputObjectType({
  name: 'CreatePriceInput',
  definition(t) {
    t.nonNull.string('currency');
    t.nonNull.int('amount');
    t.boolean('active');
    t.string('nickname');
  },
});

export const UpdatePriceInput = n.inputObjectType({
  name: 'UpdatePriceInput',
  definition(t) {
    t.boolean('active');
    t.string('nickname');
  },
});
