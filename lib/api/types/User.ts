import { objectType, extendType } from 'nexus';
import { createPageInfoFromNodes } from '../utils';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('email');
    t.string('name');
  },
});

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.connectionField('users', {
      type: User,
      pageInfoFromNodes: createPageInfoFromNodes((ctx) =>
        ctx.prisma.user.count(),
      ),
      async nodes(_, args, ctx) {
        let skip = Number(args.after) + 1;
        if (Number.isNaN(skip)) skip = 0;

        let users = await ctx.prisma.user.findMany({ take: args.first, skip });
        return users;
      },
    });
  },
});
