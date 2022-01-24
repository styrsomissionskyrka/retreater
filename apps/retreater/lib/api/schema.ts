import * as z from 'zod';
import { PostStatusSchema, ListParametersSchema, utils, filters } from '@styrsomissionskyrka/types';

export type PostListParameters = z.infer<typeof PostListParametersSchema>;
export type PostListParameterInput = z.input<typeof PostListParametersSchema>;
export const PostListParametersSchema = ListParametersSchema.extend({
  author: utils.id.optional(),
  author_exclude: utils.id.optional(),
  categories: filters.terms.optional(),
  categories_exclude: filters.terms.optional(),
  context: utils.context.optional(),
  exclude: utils.id.optional(),
  include: utils.id.optional(),
  modified_before: filters.date.optional(),
  modified_after: filters.date.optional(),
  search: z.string().nonempty().optional(),
  slug: z.array(z.string()).optional(),
  status: z
    .union([z.array(PostStatusSchema), PostStatusSchema])
    .transform((x) => (Array.isArray(x) ? x : [x]))
    .optional(),
  sticky: z.boolean().optional(),
  tags: filters.terms.optional(),
  tags_exclude: filters.terms.optional(),
  tax_relation: utils.operator.optional(),
});
