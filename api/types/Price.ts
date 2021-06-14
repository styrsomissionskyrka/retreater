import * as path from 'path';

import * as n from 'nexus';
import { AbstractResolveReturn } from 'nexus/dist/typegenTypeHelpers';

import { ignoreNull, stripeTimestampToMs } from '../utils';
import { Retreat } from './Retreat';

type PriceParentType = AbstractResolveReturn<'PriceParent'>;
const isPriceParentType = (input: unknown): input is PriceParentType => {
  return typeof input === 'string' && ['Retreat'].includes(input);
};

export const PriceParent = n.unionType({
  name: 'PriceParent',
  resolveType(source) {
    let type = source.metadata?.type;
    if (isPriceParentType(type)) return type;
    return null;
  },
  definition(t) {
    t.members(Retreat);
  },
});

export const PriceMetadata = n.objectType({
  name: 'PriceMetadata',
  sourceType: {
    module: '@prisma/client',
    export: 'PriceMetadata',
  },
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.id('priceId');

    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');

    t.string('description');
  },
});

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

    t.nonNull.field('parent', {
      type: PriceParent,
      resolve(source, _, ctx) {
        if (typeof source.product === 'string') return ctx.stripe.products.retrieve(source.product);
        if ('deleted' in source.product) throw new Error('Trying to retrieve a deleted product.');
        return source.product;
      },
    });

    t.nonNull.field('metadata', {
      type: PriceMetadata,
      async resolve(source, _, ctx) {
        let metadata = await ctx.prisma.priceMetadata.findUnique({ where: { priceId: source.id } });

        if (metadata == null) {
          metadata = await ctx.prisma.priceMetadata.create({ data: { priceId: source.id } });
        }

        return metadata;
      },
    });
  },
});

export const RetreatWithPrice = n.extendType({
  type: 'Retreat',
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
