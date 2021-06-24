import * as path from 'path';

import * as n from 'nexus';

export const Refund = n.objectType({
  name: 'Refund',
  sourceType: {
    module: path.join(process.cwd(), 'api/source-types.ts'),
    export: 'StripeRefund',
  },
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.int('amount');
    t.nonNull.string('currency');
  },
});
