import { Prisma } from '@prisma/client';
import { objectType, extendType, enumType, arg } from 'nexus';
import { createPageInfoFromNodes } from '../utils';

export const UserRoleEnum = enumType({
  name: 'UserRoleEnum',
  members: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
});

export const User = objectType({
  name: 'User',
  sourceType: {
    module: '@prisma/client',
    export: 'User',
  },
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('email');
    t.string('name');
    t.field('role', { type: UserRoleEnum });
  },
});

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.connectionField('users', {
      type: User,
      additionalArgs: {
        role: arg({ type: UserRoleEnum }),
      },
      pageInfoFromNodes: createPageInfoFromNodes((ctx) => ctx.prisma.user.count()),
      async nodes(_, args, ctx) {
        let skip = Number(args.after) + 1;
        if (Number.isNaN(skip)) skip = 0;

        let where: Prisma.UserWhereInput | undefined;
        if (args.role != null) where = { role: args.role };

        let users = await ctx.prisma.user.findMany({ take: args.first, skip, where });
        return users;
      },
    });
  },
});
