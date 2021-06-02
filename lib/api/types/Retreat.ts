import { Prisma } from '.prisma/client';
import { enumType, objectType, extendType, nonNull, stringArg, arg, inputObjectType, idArg } from 'nexus';
import { UserInputError } from 'apollo-server-micro';
import slugify from 'slug';
import { clearUndefined, createPageInfoFromNodes } from '../utils';
import { User } from './User';

export const StatusEnum = enumType({
  name: 'StatusEnum',
  members: ['PUBLISHED', 'DRAFT', 'ARCHIVED'],
});

export const OrderByEnum = enumType({
  name: 'OrderByEnum',
  members: {
    START_DATE: 'startDate',
    CREATED_AT: 'createdAt',
    STATUS: 'status',
  },
});

export const OrderEnum = enumType({
  name: 'OrderEnum',
  members: { ASC: 'asc', DESC: 'desc' },
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

    t.nonNull.field('status', { type: StatusEnum });
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');

    t.field('createdBy', {
      type: User,
      async resolve() {
        return null;
      },
    });

    t.date('startDate');
    t.date('endDate');
    t.string('content');

    t.int('maxParticipants');
  },
});

export const RetreatQuery = extendType({
  type: 'Query',
  definition(t) {
    t.connectionField('retreats', {
      type: Retreat,
      additionalArgs: {
        status: arg({ type: StatusEnum }),
        orderBy: arg({ type: OrderByEnum, default: 'startDate' }),
        order: arg({ type: OrderEnum, default: 'asc' }),
      },
      pageInfoFromNodes: createPageInfoFromNodes((ctx) => ctx.prisma.retreat.count()),
      async nodes(_, args, ctx) {
        let skip = Number(args.after) + 1;
        if (Number.isNaN(skip)) skip = 0;

        let retreats = await ctx.prisma.retreat.findMany({
          take: args.first,
          skip,
          orderBy: { [args.orderBy ?? 'startDate']: args.order },
        });

        return retreats;
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
        status: nonNull(arg({ type: StatusEnum })),
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
