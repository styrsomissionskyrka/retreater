import {
  enumType,
  objectType,
  extendType,
  nonNull,
  stringArg,
  arg,
  inputObjectType,
  idArg,
  connectionPlugin,
} from 'nexus';
import { createPageInfoFromNodes } from '../utils';
import { User } from './User';

export const StatusEnum = enumType({
  name: 'StatusEnum',
  members: ['PUBLISHED', 'DRAFT', 'ARCHIVED'],
});

export const OrderByEnum = enumType({
  name: 'OrderByEnum',
  // members: ['START_DATE', 'CREATED_AT', 'STATUS'],
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
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('title');
    t.nonNull.string('slug');

    t.nonNull.field('status', { type: StatusEnum });
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');

    t.field('createdBy', { type: User });

    t.date('startDate');
    t.date('endDate');
    t.string('content');

    t.int('maxParticipants');
    t.int('totalParticipants');
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
      pageInfoFromNodes: createPageInfoFromNodes((ctx) =>
        ctx.prisma.retreat.count(),
      ),
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
    });
  },
});

export const PostMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createRetreatDraft', {
      type: Retreat,
      args: {
        title: nonNull(stringArg()),
      },
    });

    t.field('updateRetreat', {
      type: Retreat,
      args: {
        id: nonNull(idArg()),
        input: nonNull(arg({ type: UpdateRetreatInput })),
      },
    });

    t.field('setRetreatStatus', {
      type: Retreat,
      args: {
        id: nonNull(idArg()),
        status: nonNull(arg({ type: StatusEnum })),
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
