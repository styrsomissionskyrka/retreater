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
        return result.data;
      },
    });
  },
});
