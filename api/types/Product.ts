import * as path from 'path';

import * as n from 'nexus';

import { stripeTimestampToMs } from '../utils';

export const Product = n.objectType({
  name: 'Product',
  sourceType: {
    module: path.join(process.cwd(), 'api/source-types.ts'),
    export: 'StripeProduct',
  },
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.boolean('active');
    t.nonNull.date('created', {
      resolve: (source) => stripeTimestampToMs(source.created),
    });
    t.nonNull.date('updated', {
      resolve: (source) => stripeTimestampToMs(source.updated),
    });

    t.string('name');
    t.string('description');
    t.string('url');

    t.nonNull.list.nonNull.string('images');
  },
});
