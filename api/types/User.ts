import * as path from 'path';

import * as n from 'nexus';
import { User as Auth0User, GetUsersDataPaged } from 'auth0';

import { ensure } from '../../lib/utils/assert';
import { createPaginationMeta, hasKey } from '../utils';
import { PaginatedQuery } from './Shared';

export const Role = n.objectType({
  name: 'Role',
  sourceType: {
    module: path.join(process.cwd(), 'api/source-types.ts'),
    export: 'Role',
  },
  definition(t) {
    t.nonNull.id('id', { resolve: (source) => ensure(source.id, ' Role without id encountered') });
    t.nonNull.string('name', { resolve: (source) => ensure(source.name, ' Role without name encountered') });
    t.string('description');
  },
});

export const User = n.objectType({
  name: 'User',
  sourceType: {
    module: path.join(process.cwd(), 'api/source-types.ts'),
    export: 'User',
  },
  definition(t) {
    t.nonNull.id('id', { resolve: (source) => ensure(source.user_id, 'User without id encountered') });
    t.date('createdAt', { resolve: (source) => (source.created_at ? new Date(source.created_at) : null) });
    t.date('updatedAt', { resolve: (source) => (source.updated_at ? new Date(source.updated_at) : null) });
    t.string('name');
    t.string('nickname');
    t.string('email');
    t.string('picture');
    t.boolean('emailVerified', { resolve: (source) => source.email_verified ?? null });
    t.string('lastIp', { resolve: (source) => source.last_ip ?? null });
    t.string('lastLogin', { resolve: (source) => source.last_login ?? null });
    t.int('loginsCount', { resolve: (source) => source.logins_count ?? null });

    t.nonNull.list.field('roles', {
      type: n.nonNull(Role),
      async resolve(source, _, ctx) {
        let roles = await ctx.auth0.getUserRoles({ id: source.user_id });
        return roles.filter(hasKey('id'));
      },
    });
  },
});

export const PaginatedUser = n.objectType({
  name: 'PaginatedUser',
  definition(t) {
    t.implements(PaginatedQuery);
    t.nonNull.list.nonNull.field('items', { type: User });
  },
});

export const UserQuery = n.extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: User,
      async resolve(_, __, ctx) {
        let sessionUser = ctx.session?.user;
        if (sessionUser?.id == null) return null;

        let user = await ctx.auth0.getUser({ id: sessionUser.id });
        return hasKey('user_id', user) ? user : null;
      },
    });

    t.field('user', {
      type: User,
      args: { id: n.idArg(), email: n.stringArg() },
      async resolve(_, args, ctx) {
        let user: Auth0User | null = null;

        if (args.id != null) {
          try {
            user = await ctx.auth0.getUser({ id: args.id });
          } catch (error) {
            return null;
          }
        }

        if (args.email != null) {
          try {
            let users = await ctx.auth0.getUsersByEmail(args.email);
            user = users[0];
          } catch (error) {
            return null;
          }
        }

        return user && hasKey('user_id', user) ? user : null;
      },
    });

    t.field('users', {
      type: n.nonNull(PaginatedUser),
      args: {
        page: n.nonNull(n.intArg({ default: 1 })),
        perPage: n.nonNull(n.intArg({ default: 25 })),
        search: n.stringArg(),
      },
      async resolve(_, args, ctx) {
        let params: GetUsersDataPaged = {
          include_totals: true,
          search_engine: 'v3',
          page: args.page - 1,
          per_page: args.perPage,
        };

        if (args.search != null) {
          params.q = args.search;
        }

        let response = await ctx.auth0.getUsers(params);
        let paginationMeta = createPaginationMeta(args.page - 1, args.perPage, response.total);

        let items = response.users.filter(hasKey('user_id'));
        return { items, paginationMeta };
      },
    });
  },
});
