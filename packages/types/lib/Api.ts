import * as z from 'zod';

import * as filters from './filters';
import * as utils from './utils';

export const GlobalParametersSchema = z.object({
  _fields: z.array(z.string()).optional(),
  _embed: z.union([z.array(z.string()), z.boolean()]).optional(),
});

export const ListParametersSchema = GlobalParametersSchema.extend({
  order: utils.order.optional(),
  orderby: z.string().optional(),
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().min(1).max(100).optional(),
  before: filters.date.optional(),
  after: filters.date.optional(),
  offset: z.number().int().optional(),
});
