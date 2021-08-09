import * as Prisma from '@prisma/client';

export enum RetreatEvent {
  RETREAT_CREATED = 'retreat.created',
  RETREAT_UPDATED = 'retreat.updated',
  RETREAT_PUBLISHED = 'retreat.published',
  RETREAT_UNPUBLISHED = 'retreat.unpublished',
  RETREAT_ARCHIVED = 'retreat.archived',
  RETREAT_PRICE_CREATED = 'retreat.price_created',
  RETREAT_PRICE_UPDATED = 'retreat.price_updated',
}

export enum OrderEvent {
  ORDER_CREATED = 'order.created',
  ORDER_STATUS_UPDATED = 'order.status_updated',
  ORDER_METADATA_UPDATED = 'order.metadata_updated',
  ORDER_CHECKOUT_INIT = 'order.checkout_initiated',
  ORDER_CHECKOUT_COMPLETED = 'order.checkout_completed',
}

export type LogEvent = RetreatEvent | OrderEvent;

async function createLogInput(
  itemType: Prisma.LogItemType,
  itemId: string,
  event: LogEvent,
  prisma: Prisma.PrismaClient,
): Promise<void> {
  await prisma.logItem.create({ data: { itemId, itemType, event } });
}

export type ItemLogger<Event extends LogEvent> = (id: string, event: Event) => Promise<void>;
export type Logger = {
  retreat: ItemLogger<RetreatEvent>;
  order: ItemLogger<OrderEvent>;
};

export function createLogger(client: Prisma.PrismaClient): Logger {
  return {
    retreat: (id: string, event: RetreatEvent) => createLogInput(Prisma.LogItemType.RETREAT, id, event, client),
    order: (id: string, event: OrderEvent) => createLogInput(Prisma.LogItemType.ORDER, id, event, client),
  };
}
