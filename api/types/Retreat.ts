import * as path from 'path';

import * as n from 'nexus';
import slugify from 'slug';

import { ignoreNull, stripeTimestampToMs } from '../utils';

export const Retreat = n.objectType({
  name: 'Retreat',
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

export const RetreatQuery = n.extendType({
  type: 'Query',
  definition(t) {
    t.connectionField('retreats', {
      type: Retreat,
      additionalArgs: {
        active: n.booleanArg({ description: 'https://stripe.com/docs/api/products/list#list_products-active' }),
      },
      cursorFromNode: (node) => node?.id!,
      async nodes(_, args, ctx) {
        const result = await ctx.stripe.products.list({
          active: ignoreNull(args.active),
          limit: args.first ? args.first + 1 : args.last ? args.last + 1 : undefined,
          starting_after: ignoreNull(args.after),
          ending_before: ignoreNull(args.before),
        });

        return result.data;
      },
    });

    t.field('retreat', {
      type: Retreat,
      args: { id: n.nonNull(n.idArg()) },
      resolve(_, args, ctx) {
        try {
          return ctx.stripe.products.retrieve(args.id);
        } catch (error) {
          return null;
        }
      },
    });
  },
});

export const RetreatMutation = n.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createRetreat', {
      type: Retreat,
      args: {
        name: n.nonNull(n.stringArg()),
        description: n.stringArg(),
      },
      async resolve(_, args, ctx) {
        let retreat = await ctx.stripe.products.create({
          active: false,
          name: args.name,
          description: ignoreNull(args.description),
          shippable: false,
          metadata: { type: 'Retreat' },
        });

        let slug = slugify(retreat.name);
        await ctx.prisma.retreatMetadata.create({
          data: { retreatId: retreat.id, slug },
        });

        return retreat;
      },
    });

    t.field('updateRetreat', {
      type: Retreat,
      args: {
        id: n.nonNull(n.idArg()),
        input: n.nonNull(n.arg({ type: UpdateRetreatInput })),
      },
      async resolve(_, args, ctx) {
        return ctx.stripe.products.update(args.id, {
          name: ignoreNull(args.input.name),
          description: ignoreNull(args.input.description),
          images: ignoreNull(args.input.images),
          metadata: { type: 'Retreat' },
        });
      },
    });

    t.field('setRetreatStatus', {
      type: Retreat,
      args: {
        id: n.nonNull(n.idArg()),
        active: n.nonNull(n.booleanArg()),
      },
      resolve(_, args, ctx) {
        return ctx.stripe.products.update(args.id, { active: args.active, metadata: { type: 'Retreat' } });
      },
    });
  },
});

export const UpdateRetreatInput = n.inputObjectType({
  name: 'UpdateRetreatInput',
  definition(t) {
    t.nonNull.string('name');
    t.string('description');
    t.list.nonNull.string('images');
  },
});
