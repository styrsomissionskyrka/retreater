import * as z from 'zod';

import * as utils from './utils';
import { BaseSchema } from './Post';

export type RetreatMetadata = z.infer<typeof RetreatMetadataSchema>;
export const RetreatMetadataSchema = z.object({
  stripe_price_id: z.string().optional(),
  start_date: utils.apiDate,
  end_date: utils.apiDate,
  max_participants: z.number(),
  leaders: z.array(z.string()),
});

export type Retreat = z.infer<typeof RetreatSchema>;
export const RetreatSchema = BaseSchema.extend({
  type: z.literal('retreat'),
  meta: RetreatMetadataSchema,
  stripe_price: z.number().int().positive(),
});
