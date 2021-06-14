import * as path from 'path';

import * as n from 'nexus';

import { stripeTimestampToMs } from '../utils';

export const Product = n.objectType({
  name: 'Product',
  sourceType: {
    module: path.join(process.cwd(), 'api/source-types.ts'),
    export: 'StripeProduct',
  },
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.boolean('active');
    t.nonNull.date('created', {
      resolve: (source) => stripeTimestampToMs(source.created),
    });
    t.nonNull.date('updated', {
      resolve: (source) => stripeTimestampToMs(source.updated),
    });

    t.string('name');
    t.string('description');
    t.string('url');

    t.nonNull.list.nonNull.string('images');
  },
});

export const RetreatWithProducts = n.extendType({
  type: 'Retreat',
  definition(t) {
    t.field('registrationFee', {
      type: Product,
      async resolve(source, _, ctx) {
        if (source.registrationFee == null) return null;
        return ctx.stripe.products.retrieve(source.registrationFee);
      },
    });

    t.nonNull.list.nonNull.field('products', {
      type: Product,
      async resolve(source, _, ctx) {
        let ids: string[] = Array.isArray(source.products)
          ? source.products.filter((i): i is string => typeof i === 'string')
          : [];

        if (ids.length < 1) return [];

        let result = await ctx.stripe.products.list({ ids, limit: ids.length });
        return result.data;
      },
    });
  },
});
