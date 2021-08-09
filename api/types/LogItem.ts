import * as Prisma from '@prisma/client';
import * as n from 'nexus';

import { RetreatEvent, OrderEvent } from '../logs';
import { Order } from './Order';
import { Retreat } from './Retreat';

export const LogEventEnum = n.enumType({
  name: 'LogEventEnum',
  members: { ...RetreatEvent, ...OrderEvent },
});

export const LogItemType = n.unionType({
  name: 'LogItemType',
  resolveType(source) {
    if ('slug' in source) return 'Retreat';
    if ('price' in source) return 'Order';
    return null;
  },
  definition(t) {
    t.members(Retreat, Order);
  },
});

export const LogItem = n.objectType({
  name: 'LogItem',
  sourceType: {
    module: '@prisma/client',
    export: 'LogItem',
  },
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.date('createdAt');
    t.nonNull.field('event', { type: LogEventEnum });
    t.field('item', {
      type: LogItemType,
      resolve(source, _, ctx) {
        switch (source.itemType) {
          case Prisma.LogItemType.ORDER:
            return ctx.prisma.order.findUnique({ where: { id: source.itemId } });
          case Prisma.LogItemType.RETREAT:
            return ctx.prisma.retreat.findUnique({ where: { id: source.itemId } });
        }
      },
    });
  },
});

export const LogItemQuery = n.extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('logs', {
      type: n.nonNull(LogItem),
      args: { id: n.nonNull(n.idArg()) },
      resolve(_, args, ctx) {
        return ctx.prisma.logItem.findMany({ where: { itemId: args.id }, orderBy: { createdAt: 'desc' } });
      },
    });
  },
});
