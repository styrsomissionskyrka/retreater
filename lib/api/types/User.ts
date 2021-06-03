import { objectType, extendType, enumType, arg, idArg, nonNull, stringArg } from 'nexus';
import { resolve } from 'path/posix';
import { OrderEnum } from './';

export const UserRoleEnum = enumType({
  name: 'UserRoleEnum',
  members: { SUPER_ADMIN: 'superadmin', ADMIN: 'admin', EDITOR: 'editor' },
});

export const UserOrderByEnum = enumType({
  name: 'UserSortByEnum',
  members: {
    EMAIL: 'email',
    CREATED_AT: 'created_at',
    NAME: 'name',
  },
});

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('email');
    t.nonNull.boolean('emailVerified');
    t.nonNull.date('createdAt');
    t.nonNull.date('updateAt');
    t.string('name');
    t.string('picture');
    t.string('lastIp');
    t.date('lastLogin');
    t.nonNull.int('loginsCount');

    t.nonNull.list.nonNull.field('roles', {
      type: UserRoleEnum,
      async resolve(user, _, ctx) {
        return [];
      },
    });
  },
});

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: User,
      async resolve(_, __, ctx) {
        let user = ctx.user;
        if (user == null || user.sub == null) return null;

        try {
          let id = user.sub;
          let data = await ctx.auth0.fetchUser(id);
          return data;
        } catch (error) {
          return null;
        }
      },
    });

    t.field('user', {
      type: User,
      args: {
        id: nonNull(idArg()),
      },
      async resolve() {
        return null;
      },
    });

    t.connectionField('users', {
      type: User,
      additionalArgs: {
        order: nonNull(arg({ type: OrderEnum, default: 'asc' })),
        orderBy: nonNull(arg({ type: UserOrderByEnum, default: 'created_at' })),
        search: stringArg(),
      },
      async resolve(_, args, ctx) {
        let page = 0;
        if (args.after != null) {
          let split = Buffer.from(args.after, 'base64').toString().split(':');
          page = Number(split[1]);
        }

        let { users, pagination } = await ctx.auth0.listUsers({ ...args, page });

        let currentPage = pagination.start;
        let hasNextPage = currentPage < pagination.length - 1;
        let hasPreviousPage = currentPage > 0;

        let startCursor = Buffer.from(`cursor:${currentPage - 1}`).toString('base64');
        let endCursor = Buffer.from(`cursor:${currentPage + 1}`).toString('base64');

        let edges = users.map((user) => ({
          cursor: endCursor,
          node: user,
        }));

        let pageInfo = {
          hasNextPage,
          hasPreviousPage,
          startCursor: hasPreviousPage ? startCursor : null,
          endCursor: hasNextPage ? endCursor : null,
        };

        return {
          pageInfo,
          edges,
        };
      },
    });
  },
});
