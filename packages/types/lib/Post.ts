import * as z from 'zod';

import { BlockSchema } from './Block';
import * as utils from './utils';

export type PostStatus = z.infer<typeof PostStatusSchema>;
export const PostStatusSchema = z.enum(['publish', 'future', 'draft', 'pending', 'private']);

export type CommentStatus = z.infer<typeof CommentStatusSchema>;
export const CommentStatusSchema = z.enum(['open', 'closed']);

export type Base = z.infer<typeof BaseSchema>;
export const BaseSchema = z.object({
  id: utils.id,
  slug: z.string(),
  title: utils.rendered,
  type: z.string(),
  date: utils.apiDate,
  date_gmt: utils.apiDate,
  modified: utils.apiDate,
  modified_gmt: utils.apiDate,
  meta: utils.emptyArrayToObject,
  content_blocks: z.array(BlockSchema),
  has_content_blocks: z.boolean(),
});

export type Post = z.infer<typeof PostSchema>;
export const PostSchema = BaseSchema.extend({
  type: z.literal('post'),
  author: utils.id,
  categories: z.array(utils.id),
  content: utils.rendered,
  excerpt: utils.rendered,
  featured_media: z
    .number()
    .int()
    .transform((x) => (x === 0 ? null : x)),
  link: z.string(),
  meta: utils.emptyArrayToObject,
  status: PostStatusSchema,
  sticky: z.boolean(),
  tags: z.array(utils.id),
});
