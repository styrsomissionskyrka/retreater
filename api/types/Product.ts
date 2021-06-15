import * as path from 'path';

import * as n from 'nexus';
import { UserInputError } from 'apollo-server-micro';

import { stripeTimestampToMs, ignoreNull, ensureProductArray } from '../utils';

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
        let ids = ensureProductArray(source.products);
        if (ids.length < 1) return [];

        let result = await ctx.stripe.products.list({ ids, limit: ids.length });
        return result.data;
      },
    });
  },
});

export const ProductMutation = n.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createProduct', {
      type: Product,
      args: {
        retreatId: n.nonNull(n.idArg()),
        input: n.nonNull(n.arg({ type: CreateProductInput })),
      },
      async resolve(_, args, ctx) {
        let retreat = await ctx.prisma.retreat.findUnique({
          where: { id: args.retreatId },
          select: { products: true },
        });
        if (retreat === null) throw new UserInputError("Retreat with given id can't be found.");

        let product = await ctx.stripe.products.create({
          name: args.input.name,
          active: ignoreNull(args.input.active),
          description: ignoreNull(args.input.description),
          images: ignoreNull(args.input.images),
        });

        let products = ensureProductArray(retreat.products);
        products.push(product.id);

        await ctx.prisma.retreat.update({ where: { id: args.retreatId }, data: { products } });
        return product;
      },
    });

    t.field('updateProduct', {
      type: Product,
      args: {
        id: n.nonNull(n.idArg()),
        input: n.nonNull(n.arg({ type: UpdateProductInput })),
      },
      async resolve(_, args, ctx) {
        let product = await ctx.stripe.products.update(args.id, {
          name: ignoreNull(args.input.name),
          active: ignoreNull(args.input.active),
          description: ignoreNull(args.input.description),
          images: ignoreNull(args.input.images),
        });

        return product;
      },
    });
  },
});

export const CreateProductInput = n.inputObjectType({
  name: 'CreateProductInput',
  definition(t) {
    t.nonNull.string('name');
    t.boolean('active');
    t.string('description');
    t.list.nonNull.string('images');
  },
});

export const UpdateProductInput = n.inputObjectType({
  name: 'UpdateProductInput',
  definition(t) {
    t.string('name');
    t.boolean('active');
    t.string('description');
    t.list.nonNull.string('images');
  },
});
