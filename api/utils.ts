import { Claims, UserRole } from '@auth0/nextjs-auth0';
import { Prisma } from '@prisma/client';

import { arrayify } from '../lib/utils/array';
import { Context } from './context';

export function ignoreNull<T>(value: T | null | undefined): T | undefined {
  if (value == null) return undefined;
  return value;
}

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

export function stripeTimestampToMs(seconds: number) {
  return new Date(seconds * 1000);
}

export function ensureProductArray(value: Prisma.JsonValue | null): string[] {
  if (Array.isArray(value)) return value.filter((i): i is string => typeof i === 'string');
  return [];
}
