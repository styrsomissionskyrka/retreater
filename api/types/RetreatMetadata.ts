import { UserInputError } from 'apollo-server-errors';
import * as n from 'nexus';
import slugify from 'slug';

import { ignoreNull } from '../utils';
import { Retreat } from './Retreat';

export const RetreatMetadata = n.objectType({
  name: 'RetreatMetadata',
  sourceType: {
    module: '@prisma/client',
    export: 'RetreatMetadata',
  },
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.id('retreatId');

    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');

    t.nonNull.string('slug');
    t.string('content');

    t.date('startDate');
    t.date('endDate');
    t.nonNull.int('maxParticipants');
  },
});

export const ExtendedRetreat = n.extendType({
  type: 'Retreat',
  definition(t) {
    t.nonNull.field('metadata', {
      type: RetreatMetadata,
      async resolve(source, _, ctx) {
        let metadata = await ctx.prisma.retreatMetadata.findUnique({ where: { retreatId: source.id } });

        if (metadata == null) {
          let slug = slugify(source.name);
          metadata = await ctx.prisma.retreatMetadata.create({ data: { retreatId: source.id, slug } });
        }

        return metadata;
      },
    });
  },
});

export const RetreatMetadataQuery = n.extendType({
  type: 'Query',
  definition(t) {
    t.field('retreatBySlug', {
      type: Retreat,
      args: {
        slug: n.nonNull(n.stringArg()),
      },
      async resolve(_, args, ctx) {
        let metadata = await ctx.prisma.retreatMetadata.findUnique({
          where: { slug: args.slug },
          select: { retreatId: true },
        });

        if (metadata == null) return null;
        return ctx.stripe.products.retrieve(metadata.retreatId);
      },
    });

    t.field('retreatMetadata', {
      type: RetreatMetadata,
      args: {
        id: n.idArg(),
        retreatId: n.idArg(),
      },
      async resolve(_, args, ctx) {
        if (args.id == null && args.retreatId == null) {
          throw new UserInputError('You must define either an id (metadata id) retreatId.');
        }

        return ctx.prisma.retreatMetadata.findUnique({
          where: {
            id: ignoreNull(args.id),
            retreatId: ignoreNull(args.retreatId),
          },
        });
      },
    });
  },
});

export const RetreatMetadataMutation = n.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateRetreatMetadata', {
      type: RetreatMetadata,
      args: {
        id: n.nonNull(n.idArg()),
        input: n.nonNull(n.arg({ type: UpdateRetreatMetadataInput })),
      },
      async resolve(_, args, ctx) {
        let metadata = await ctx.prisma.retreatMetadata.update({
          where: { id: args.id },
          data: {
            slug: ignoreNull(args.input.slug),
            content: ignoreNull(args.input.content),
            startDate: ignoreNull(args.input.startDate),
            endDate: ignoreNull(args.input.endDate),
            maxParticipants: ignoreNull(args.input.maxParticipants),
          },
        });

        return metadata;
      },
    });
  },
});

export const UpdateRetreatMetadataInput = n.inputObjectType({
  name: 'UpdateRetreatMetadataInput',
  definition(t) {
    t.string('slug');
    t.string('content');
    t.date('startDate');
    t.date('endDate');
    t.int('maxParticipants');
  },
});
