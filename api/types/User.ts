import * as n from 'nexus';

import { authorizedWithRoles } from '../utils';

export const UserRoleEnum = n.enumType({
  name: 'UserRoleEnum',
  members: { SUPER_ADMIN: 'superadmin', ADMIN: 'admin', EDITOR: 'editor' },
});

export const UserOrderByEnum = n.enumType({
  name: 'UserSortByEnum',
  members: {
    EMAIL: 'email',
    CREATED_AT: 'created_at',
    NAME: 'name',
  },
});

export const User = n.objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('email');
    t.nonNull.boolean('emailVerified');
    t.nonNull.date('createdAt');
    t.nonNull.date('updateAt');
    t.string('name');
    t.string('picture');

    t.string('lastIp', { authorize: authorizedWithRoles(['superadmin']) });
    t.date('lastLogin', { authorize: authorizedWithRoles(['superadmin']) });
    t.nonNull.int('loginsCount', { authorize: authorizedWithRoles(['superadmin']) });

    t.nonNull.list.nonNull.field('roles', {
      type: UserRoleEnum,
      async resolve(user, _, ctx) {
        return [];
      },
    });
  },
});

export const UserQuery = n.extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: User,
      async resolve(_, __, ctx) {
        return null;
      },
    });

    t.field('user', {
      type: User,
      args: { id: n.nonNull(n.idArg()) },
      authorize: authorizedWithRoles(['admin', 'superadmin']),
      async resolve(_, args, ctx) {
        return null;
      },
    });
  },
});
