import * as z from 'zod';

import * as utils from './utils';

export const date = z.union([z.date(), z.number().int(), z.string()]).transform((x) => {
  if (x instanceof Date) return x.toISOString();
  return new Date(x).toISOString();
});

export const terms = z.union([
  utils.id,
  z.object({
    include_children: z.boolean().optional(),
    operator: utils.operator.optional(),
    terms: utils.id,
  }),
]);
