import {
  enumType,
  objectType,
  extendType,
  nonNull,
  stringArg,
  arg,
  inputObjectType,
  idArg,
} from 'nexus';
import { User } from './User';

export const StatusEnum = enumType({
  name: 'StatusEnum',
  members: ['PUBLISHED', 'DRAFT', 'ARCHIVED'],
});

export const OrderByEnum = enumType({
  name: 'OrderByEnum',
  members: ['START_DATE', 'CREATED_DATE', 'STATUS'],
});

export const OrderEnum = enumType({
  name: 'OrderEnum',
  members: ['ASC', 'DESC'],
});

export const Retreat = objectType({
  name: 'Retreat',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('title');
    t.nonNull.string('slug');

    t.nonNull.field('status', { type: StatusEnum });
    t.nonNull.date('created');
    t.nonNull.date('updated');

    t.nonNull.field('createdBy', { type: User });
    t.nonNull.list.nonNull.field('editedBy', { type: User });

    t.date('startDate');
    t.date('endDate');
    t.string('content');

    t.nonNull.int('maxParticipants');
    t.nonNull.int('totalParticipants');
  },
});

export const RetreatQuery = extendType({
  type: 'Query',
  definition(t) {
    t.connectionField('retreats', {
      type: Retreat,
      additionalArgs: {
        status: arg({ type: StatusEnum }),
        orderBy: arg({ type: OrderByEnum, default: 'START_DATE' }),
        order: arg({ type: OrderEnum, default: 'ASC' }),
      },
      nodes() {
        return [];
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
