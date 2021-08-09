import * as path from 'path';

import * as n from 'nexus';

import { stripeTimestampToMs } from '../utils';

export const Coupon = n.objectType({
  name: 'Coupon',
  sourceType: {
    module: path.join(process.cwd(), 'api/source-types.ts'),
    export: 'StripeCoupon',
  },
  definition(t) {
    t.nonNull.id('id');
    t.int('amountOff', { resolve: (source) => source.amount_off });
    t.float('percentOff', { resolve: (source) => source.percent_off });
    t.string('currency');
    t.nonNull.date('created', { resolve: (source) => stripeTimestampToMs(source.created) });
  },
});
