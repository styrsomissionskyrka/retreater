import { Prisma } from '@prisma/client';
import { enumType, objectType, extendType, nonNull, stringArg, arg, inputObjectType, idArg, intArg, list } from 'nexus';
import { UserInputError } from 'apollo-server-micro';
import slugify from 'slug';
import { clearUndefined } from '../utils';
import { User, OrderEnum, PaginatedQuery } from '.';

export const RetreatStatusEnum = enumType({
  name: 'RetreatStatusEnum',
  members: ['PUBLISHED', 'DRAFT', 'ARCHIVED'],
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

    t.field('createdBy', {
      type: User,
      async resolve(source, _, ctx) {
        if (source.createdById != null) return ctx.auth0.user.load(source.createdById);
        return null;
      },
    });

    t.date('startDate');
    t.date('endDate');
    t.string('content');

    t.int('maxParticipants');
  },
});

export const PaginatedRetreat = objectType({
  name: 'PaginatedRetreat',
  definition(t) {
    t.implements(PaginatedQuery);
    t.nonNull.list.nonNull.field('retreats', { type: Retreat });
  },
});

export const RetreatQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('retreats', {
      type: PaginatedRetreat,
      args: {
        page: nonNull(intArg({ default: 0 })),
        perPage: nonNull(intArg({ default: 25 })),
        order: nonNull(arg({ type: OrderEnum, default: 'asc' })),
        orderBy: nonNull(arg({ type: RetreatOrderByEnum, default: 'startDate' })),
        search: stringArg(),
        status: list(arg({ type: nonNull(RetreatStatusEnum) })),
      },
      async resolve(_, args, ctx) {
        let skip = args.perPage * args.page;
        let take = args.perPage;

        let where = {
          AND: [
            { status: args.status != null ? { in: args.status } : undefined },
            {
              OR: [
                { title: args.search != null ? { contains: args.search } : undefined },
                { content: args.search != null ? { contains: args.search } : undefined },
              ],
            },
          ],
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
          hasPreviousPage: args.page > 0,
          currentPage: args.page,
          totalPages: Math.ceil(total / (args.perPage || 1)),
          perPage: args.perPage,
          totalItems: total,
        };

        return { retreats, paginationMeta };
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
      args: {
        title: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        let slug = slugify(args.title);

        let similarSlugs = await ctx.prisma.retreat.count({
          where: { slug: { contains: slug } },
        });

        if (similarSlugs > 0) slug += `-${similarSlugs + 1}`;

        let retreat = await ctx.prisma.retreat.create({
          data: { title: args.title, slug },
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
