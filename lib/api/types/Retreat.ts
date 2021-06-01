import { enumType, objectType, extendType } from 'nexus';

import { Node, DateScalar } from './';

const StatusEnum = enumType({
  name: 'StatusEnum',
  members: ['PUBLISHED', 'DRAFT', 'ARCHIVED'],
});

export const Retreat = objectType({
  name: 'Retreat',
  isTypeOf(source) {
    return 'title' in source;
  },
  definition(t) {
    t.implements(Node);
    t.string('title');
    t.string('slug');

    t.field('status', { type: StatusEnum });
    t.field('created', { type: DateScalar });
    t.field('updated', { type: DateScalar });

    t.string('content');

    t.int('maxParticipants');
    t.int('totalParticipants');
  },
});

export const RetreatQuery = extendType({
  type: 'Query', // 2
  definition(t) {
    t.nonNull.list.field('listRetreats', {
      type: Retreat,
    });
  },
});
