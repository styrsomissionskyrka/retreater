import { UserInputError } from 'apollo-server-errors';
import axios from 'axios';
import { objectType, extendType, enumType, arg } from 'nexus';
import { resolve } from 'path/posix';
import { NexusGenEnums } from '../../../generated/nexus-typegen';
import { createAuth0User, Auth0User, Auth0Role } from '../../utils/auth0';

const roles: NexusGenEnums['UserRoleEnum'][] = ['superadmin', 'admin', 'editor'];

function isUserRole(input: unknown): input is NexusGenEnums['UserRoleEnum'] {
  return roles.includes(input as any);
}

export const UserRoleEnum = enumType({
  name: 'UserRoleEnum',
  members: { SUPER_ADMIN: 'superadmin', ADMIN: 'admin', EDITOR: 'editor' },
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
        try {
          let { data } = await ctx.auth0.get<Auth0Role[]>(`/users/${user.id}/roles`);
          let roles = data.map((r) => r.name).filter(isUserRole);
          return roles;
        } catch (error) {
          console.log(error);
          return [];
        }
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
          let { data } = await ctx.auth0.get<Auth0User>(`/users/${id}`);

          return createAuth0User(data);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            throw new UserInputError('Given id does not belong to an existing user');
          }

          return null;
        }
      },
    });

    t.field('user', {
      type: User,
      async resolve() {
        return null;
      },
    });

    t.connectionField('users', {
      type: User,
      additionalArgs: {
        role: arg({ type: UserRoleEnum }),
      },
      async nodes(_, __, ___) {
        return [];
      },
    });
  },
});
