import * as n from 'nexus';
import { Prisma } from '@prisma/client';

import { authorizedWithRoles, createPaginationMeta } from '../utils';
import { PaginatedQuery } from '.';

export const Account = n.objectType({
  name: 'Account',
  sourceType: {
    module: '@prisma/client',
    export: 'Account',
  },
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('type');
    t.nonNull.string('provider');
    t.nonNull.string('providerAccountId');

    t.field('user', {
      type: User,
      resolve: (source, _, ctx) => ctx.prisma.user.findUnique({ where: { id: source.userId } }),
    });
  },
});

export const Session = n.objectType({
  name: 'Session',
  sourceType: { module: '@prisma/client', export: 'Session' },
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.date('expires');
    t.field('user', {
      type: User,
      resolve: (source, _, ctx) => ctx.prisma.user.findUnique({ where: { id: source.userId } }),
    });
  },
});

export const User = n.objectType({
  name: 'User',
  sourceType: {
    module: '@prisma/client',
    export: 'User',
  },
  definition(t) {
    t.nonNull.id('id');
    t.string('email');
    t.string('name');
    t.string('image');
    t.date('emailVerified');

    t.list.field('accounts', {
      type: Account,
      resolve: (source, _, ctx) => {
        return ctx.prisma.account.findMany({ where: { userId: source.id } });
      },
    });

    t.list.field('sessions', {
      type: Session,
      resolve: (source, _, ctx) => {
        return ctx.prisma.session.findMany({ where: { userId: source.id } });
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
        if (ctx.session?.user?.email == null) return null;
        return ctx.prisma.user.findUnique({ where: { email: ctx.session.user.email } });
      },
    });

    t.field('user', {
      type: User,
      args: { id: n.idArg(), email: n.stringArg() },
      authorize: authorizedWithRoles(['admin', 'superadmin']),
      async resolve(_, args, ctx) {
        if (args.id == null || args.email == null) return null;
        let where = args.id ? { id: args.id } : { email: args.email };
        return ctx.prisma.user.findUnique({ where });
      },
    });

    t.field('users', {
      type: n.nonNull(PaginatedUser),
      authorize: authorizedWithRoles(['admin', 'superadmin']),
      args: {
        page: n.nonNull(n.intArg({ default: 1 })),
        perPage: n.nonNull(n.intArg({ default: 25 })),
        search: n.stringArg(),
      },
      async resolve(_, args, ctx) {
        let skip = args.perPage * (args.page - 1);
        let take = args.perPage;

        let where: Prisma.UserWhereInput | undefined = args.search
          ? {
              OR: {
                email: { contains: args.search },
                name: { contains: args.search },
              },
            }
          : undefined;

        let users = await ctx.prisma.user.findMany({
          take,
          skip,
          orderBy: { email: 'desc' },
          where,
        });

        let total = await ctx.prisma.user.count({ where });
        let paginationMeta = createPaginationMeta(args.page, args.perPage, total);

        return { items: users, paginationMeta };
      },
    });
  },
});
