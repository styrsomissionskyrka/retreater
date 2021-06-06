import { objectType, extendType, enumType, arg, idArg, nonNull, stringArg, intArg } from 'nexus';
import { authorizedWithRoles } from '../utils';
import { OrderEnum, PaginatedQuery } from '.';

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

    t.string('lastIp', { authorize: authorizedWithRoles(['superadmin']) });
    t.date('lastLogin', { authorize: authorizedWithRoles(['superadmin']) });
    t.nonNull.int('loginsCount', { authorize: authorizedWithRoles(['superadmin']) });

    t.nonNull.list.nonNull.field('roles', {
      type: UserRoleEnum,
      async resolve(user, _, ctx) {
        return ctx.auth0.roles.load(user.id);
      },
    });
  },
});

export const PaginatedUser = objectType({
  name: 'PaginatedUser',
  definition(t) {
    t.implements(PaginatedQuery);
    t.nonNull.list.nonNull.field('items', { type: User });
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
          let data = await ctx.auth0.user.load(id);
          return data;
        } catch (error) {
          return null;
        }
      },
    });

    t.field('user', {
      type: User,
      args: { id: nonNull(idArg()) },
      authorize: authorizedWithRoles(['admin', 'superadmin']),
      async resolve(_, args, ctx) {
        return ctx.auth0.user.load(args.id);
      },
    });

    t.field('users', {
      type: PaginatedUser,
      args: {
        page: nonNull(intArg({ default: 0 })),
        perPage: nonNull(intArg({ default: 25 })),
        order: nonNull(arg({ type: OrderEnum, default: 'asc' })),
        orderBy: nonNull(arg({ type: UserOrderByEnum, default: 'created_at' })),
        search: stringArg(),
      },
      authorize: authorizedWithRoles(['admin', 'superadmin']),
      async resolve(_, args, ctx) {
        let { users, pagination } = await ctx.auth0.listUsers(args);
        let totalPages = Math.ceil(pagination.total / (pagination.limit || 1));

        return {
          paginationMeta: {
            hasNextPage: pagination.start < totalPages - 1,
            hasPreviousPage: pagination.start > 0,
            currentPage: pagination.start,
            totalPages,
            perPage: pagination.limit,
            totalItems: pagination.total,
          },
          users,
        };
      },
    });
  },
});
