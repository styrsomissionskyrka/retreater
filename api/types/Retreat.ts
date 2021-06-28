import { OrderState, Prisma, RetreatStatus } from '@prisma/client';
import { enumType, objectType, extendType, nonNull, stringArg, arg, inputObjectType, idArg, intArg } from 'nexus';
import { UserInputError } from 'apollo-server-micro';
import slugify from 'slug';

import { compact } from '../../lib/utils/array';
import { clearUndefined, authorizedWithRoles } from '../utils';
import { OrderEnum, PaginatedQuery } from '.';

export const RetreatStatusEnum = enumType({
  name: 'RetreatStatusEnum',
  members: RetreatStatus,
});

export const RetreatOrderByEnum = enumType({
  name: 'RetreatOrderByEnum',
  members: {
    START_DATE: 'startDate',
    CREATED_AT: 'createdAt',
    STATUS: 'status',
  },
});

export const Retreat = objectType({
  name: 'Retreat',
  sourceType: {
    module: '@prisma/client',
    export: 'Retreat',
  },
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('title');
    t.nonNull.string('slug');

    t.nonNull.field('status', { type: RetreatStatusEnum });
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');

    t.date('startDate');
    t.date('endDate');
    t.string('content');

    t.nonNull.int('maxParticipants');
    t.nonNull.int('bookedParticipants', {
      async resolve(source, _, ctx) {
        return ctx.prisma.order.count({ where: { retreatId: source.id, state: OrderState.CONFIRMED } });
      },
    });
  },
});

export const PaginatedRetreat = objectType({
  name: 'PaginatedRetreat',
  definition(t) {
    t.implements(PaginatedQuery);
    t.nonNull.list.nonNull.field('items', { type: Retreat });
  },
});

export const RetreatQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('retreats', {
      type: nonNull(PaginatedRetreat),
      args: {
        page: nonNull(intArg({ default: 1 })),
        perPage: nonNull(intArg({ default: 25 })),
        order: nonNull(arg({ type: OrderEnum, default: 'asc' })),
        orderBy: nonNull(arg({ type: RetreatOrderByEnum, default: 'createdAt' })),
        search: stringArg(),
        status: arg({ type: RetreatStatusEnum }),
      },
      async resolve(_, args, ctx) {
        let skip = args.perPage * (args.page - 1);
        let take = args.perPage;

        let where = {
          AND: compact([
            args.status != null ? { status: { in: args.status } } : { status: { not: RetreatStatus.ARCHIVED } },
            args.search != null
              ? {
                  OR: compact([{ title: { contains: args.search } }, { content: { contains: args.search } }]),
                }
              : null,
          ]).filter(Boolean),
        };

        let retreats = await ctx.prisma.retreat.findMany({
          take,
          skip,
          orderBy: { [args.orderBy]: args.order },
          where,
        });

        let total = await ctx.prisma.retreat.count({ where });

        let paginationMeta = {
          hasNextPage: args.perPage * (args.page + 1) < total,
          hasPreviousPage: args.page > 1,
          currentPage: args.page,
          totalPages: Math.ceil(total / (args.perPage || 1)),
          perPage: args.perPage,
          totalItems: total,
        };

        return { items: retreats, paginationMeta };
      },
    });

    t.field('retreat', {
      type: Retreat,
      args: { id: idArg(), slug: stringArg() },
      async resolve(_, args, ctx) {
        if (isValidArgs(args)) return ctx.prisma.retreat.findUnique({ where: args });
        throw new UserInputError('Query requires either an id or a slug input');
      },
    });
  },
});

function isValidArgs(args: any): args is Prisma.RetreatWhereUniqueInput {
  return args.id != null || args.slug != null;
}

export const RetreatMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createRetreatDraft', {
      type: Retreat,
      args: { title: nonNull(stringArg()) },
      authorize: authorizedWithRoles(['editor', 'admin', 'superadmin']),
      async resolve(_, args, ctx) {
        let slug = slugify(args.title);

        let similarSlugs = await ctx.prisma.retreat.count({
          where: { slug: { contains: slug } },
        });

        if (similarSlugs > 0) slug += `-${similarSlugs + 1}`;

        let retreat = await ctx.prisma.retreat.create({
          data: { title: args.title, slug, maxParticipants: 10, products: [] },
        });

        return retreat;
      },
    });

    t.field('updateRetreat', {
      type: Retreat,
      args: {
        id: nonNull(idArg()),
        input: nonNull(arg({ type: UpdateRetreatInput })),
      },
      authorize: authorizedWithRoles(['editor', 'admin', 'superadmin']),
      async resolve(_, args, ctx) {
        let data = clearUndefined(args.input);
        let retreat = await ctx.prisma.retreat.update({ where: { id: args.id }, data });
        return retreat;
      },
    });

    t.field('setRetreatStatus', {
      type: Retreat,
      args: {
        id: nonNull(idArg()),
        status: nonNull(arg({ type: RetreatStatusEnum })),
      },
      authorize: authorizedWithRoles(['editor', 'admin', 'superadmin']),
      async resolve(_, args, ctx) {
        let retreat = await ctx.prisma.retreat.update({ where: { id: args.id }, data: { status: args.status } });
        return retreat;
      },
    });
  },
});

export const UpdateRetreatInput = inputObjectType({
  name: 'UpdateRetreatInput',
  definition(t) {
    t.string('title');
    t.string('content');
    t.date('startDate');
    t.date('endDate');
    t.int('maxParticipants');
  },
});
