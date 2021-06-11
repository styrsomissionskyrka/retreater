import { Claims, UserRole } from '@auth0/nextjs-auth0';

import { arrayify } from '../lib/utils/array';
import { Context } from './context';

export function clearUndefined<O extends Record<string, unknown>>(object: O): RequiredFields<O> {
  let proxy: Record<string, any> = {};

  for (let key of Object.keys(object)) {
    let v = object[key];
    if (typeof v !== 'undefined') {
      proxy[key] = v;
    }
  }

  return proxy as RequiredFields<O>;
}

type RequiredFields<P> = {
  [K in keyof P]-?: NonNullable<P[K]>;
};

export function userHasRoles(user: Claims, roles: UserRole | UserRole[]) {
  let expectedRoles = arrayify(roles);
  let userRoles = user['https://styrsomissionskyrka.se/roles'] ?? [];
  return expectedRoles.some((role) => userRoles.includes(role));
}

export function authorizedWithRoles(roles: UserRole[]) {
  return (_: unknown, __: unknown, ctx: Context) => {
    return ctx.user != null && userHasRoles(ctx.user, roles);
  };
}
