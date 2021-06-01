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

const StatusEnum = enumType({
  name: 'StatusEnum',
  members: ['PUBLISHED', 'DRAFT', 'ARCHIVED'],
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

    t.nonNull.string('content');

    t.nonNull.int('maxParticipants');
    t.nonNull.int('totalParticipants');
  },
});

export const RetreatQuery = extendType({
  type: 'Query',
  definition(t) {
    t.connectionField('retreats', {
      type: Retreat,
      additionalArgs: { status: arg({ type: StatusEnum }) },
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
    t.int('maxParticipants');
  },
});
