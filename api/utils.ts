import { Claims, UserRole } from '@auth0/nextjs-auth0';
import { OrderStatus, Prisma, Retreat, RetreatStatus } from '@prisma/client';

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

export function ensureArrayOfIds(value: Prisma.JsonValue | null): string[] {
  if (Array.isArray(value)) return value.filter((i): i is string => typeof i === 'string');
  return [];
}

export async function countBlockingOrders(retreatId: string, ctx: Context): Promise<number> {
  return ctx.prisma.order.count({ where: { retreatId, status: { in: [OrderStatus.CONFIRMED, OrderStatus.PENDING] } } });
}

export async function isRetreatOrderable(retreat: Retreat | null | undefined, ctx: Context): Promise<boolean> {
  if (retreat == null) return false;
  if (retreat.status !== RetreatStatus.PUBLISHED) return false;

  let totalOrders = await countBlockingOrders(retreat.id, ctx);
  if (totalOrders >= retreat.maxParticipants) return false;

  return true;
}
