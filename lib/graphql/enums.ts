import { OrderEnum, RetreatOrderByEnum } from './generated';

export function isOrderEnum(value: any): value is OrderEnum {
  return Object.values(OrderEnum).includes(value);
}

export function ensureOrderEnum(value: any, fallback: OrderEnum): OrderEnum {
  return isOrderEnum(value) ? value : fallback;
}

export function isRetreatOrderByEnum(value: any): value is RetreatOrderByEnum {
  return Object.values(RetreatOrderByEnum).includes(value);
}

export function ensureRetreatOrderByEnum(value: any, fallback: RetreatOrderByEnum): RetreatOrderByEnum {
  return isRetreatOrderByEnum(value) ? value : fallback;
}
