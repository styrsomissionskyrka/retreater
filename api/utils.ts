import { OrderStatus, Retreat, RetreatStatus } from '@prisma/client';

import { PaginationMeta } from 'lib/graphql';

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

export function authorizedWithRoles(_: string[]) {
  return (_: unknown, __: unknown, ctx: Context) => {
    return ctx.session != null;
  };
}

export function stripeTimestampToMs(seconds: number) {
  return new Date(seconds * 1000);
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

export function createPaginationMeta(page: number, perPage: number, totalItems: number): PaginationMeta {
  return {
    hasNextPage: perPage * page < totalItems,
    hasPreviousPage: page > 1,
    currentPage: page,
    totalPages: Math.ceil(totalItems / (perPage || 1)),
    perPage: perPage,
    totalItems: totalItems,
  };
}
