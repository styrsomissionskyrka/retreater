import * as z from 'zod';

const IDSchema = z.union([z.number().int(), z.string()]).transform((x) => {
  let val = typeof x === 'number' ? x : Number(x);
  if (Number.isNaN(val)) throw new Error('Invalid integer value given');
  return val;
});

const ContextSchema = z.enum(['view', 'embed', 'edit']);

const OrderSchema = z.enum(['asc', 'desc']);

const OperatorSchema = z.enum(['AND', 'OR']);

const EmptyArrayToObjectSchema = z
  .union([z.array(z.any()), z.record(z.string(), z.unknown())])
  .transform((x) => (Array.isArray(x) ? {} : x));

export type PostStatus = z.infer<typeof PostStatusSchema>;
export const PostStatusSchema = z.enum(['publish', 'future', 'draft', 'pending', 'private']);

export type Format = z.infer<typeof FormatSchema>;
export const FormatSchema = z.enum([
  'standard',
  'aside',
  'chat',
  'gallery',
  'link',
  'image',
  'quote',
  'status',
  'video',
  'audio',
]);

export type CommentStatus = z.infer<typeof CommentStatusSchema>;
export const CommentStatusSchema = z.enum(['open', 'closed']);

export type ApiDate = z.infer<typeof ApiDateSchema>;
export const ApiDateSchema = z.string();

export type Rendered = z.infer<typeof RenderedSchema>;
export const RenderedSchema = z.object({
  protected: z.boolean().optional(),
  rendered: z.string(),
});

export type Block = {
  attrs: Record<string, unknown>;
  blockName: string;
  innerBlocks: Block[];
  innerContent: (string | null)[];
  innerHTML: string;
  rendered: string;
};

export const BlockSchema: z.ZodSchema<Block, z.ZodTypeDef, any> = z.lazy(() =>
  z.object({
    attrs: EmptyArrayToObjectSchema,
    blockName: z.string(),
    innerBlocks: z.array(BlockSchema),
    innerContent: z.array(z.union([z.string(), z.null()])),
    innerHTML: z.string(),
    rendered: z.string(),
  }),
);

export type Post = z.infer<typeof PostSchema>;
export const PostSchema = z.object({
  author: IDSchema,
  blocks: z.array(BlockSchema),
  categories: z.array(IDSchema),
  comment_status: CommentStatusSchema,
  content: RenderedSchema,
  date: ApiDateSchema,
  date_gmt: ApiDateSchema,
  excerpt: RenderedSchema,
  featured_media: z
    .number()
    .int()
    .transform((x) => (x === 0 ? null : x)),
  format: FormatSchema,
  guid: RenderedSchema,
  has_blocks: z.boolean(),
  id: IDSchema,
  link: z.string(),
  meta: EmptyArrayToObjectSchema,
  modified: ApiDateSchema,
  modified_gmt: ApiDateSchema,
  ping_status: CommentStatusSchema,
  slug: z.string(),
  status: PostStatusSchema,
  sticky: z.boolean(),
  tags: z.array(IDSchema),
  template: z.string(),
  title: RenderedSchema,
  type: z.string(),
});

export const PostListSchema = z.array(PostSchema);

export type Revision = z.infer<typeof RevisionSchema>;
export const RevisionSchema = z.object({
  id: IDSchema,
  author: IDSchema,
  blocks: z.array(BlockSchema),
  content: RenderedSchema,
  date: ApiDateSchema,
  date_gmt: ApiDateSchema,
  excerpt: RenderedSchema,
  guid: RenderedSchema,
  has_blocks: z.boolean(),
  modified: ApiDateSchema,
  modified_gmt: ApiDateSchema,
  parent: IDSchema,
  title: RenderedSchema,
});

const IdsFilterSchema = z.union([z.array(IDSchema), IDSchema]).transform((x) => (Array.isArray(x) ? x : [x]));

const DateFilterSchema = z.union([z.date(), z.number().int(), z.string()]).transform((x) => {
  if (x instanceof Date) return x.toISOString();
  return new Date(x).toISOString();
});

const TermsFilterSchema = z.union([
  IdsFilterSchema,
  z.object({
    include_children: z.boolean().optional(),
    operator: OperatorSchema.optional(),
    terms: IdsFilterSchema,
  }),
]);

export const GlobalParametersSchema = z.object({
  _fields: z.array(z.string()).optional(),
  _embed: z.union([z.array(z.string()), z.boolean()]).optional(),
});

export const ListParametersSchema = GlobalParametersSchema.extend({
  order: OrderSchema.optional(),
  orderby: z.string().optional(),
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().min(1).max(100).optional(),
  before: DateFilterSchema.optional(),
  after: DateFilterSchema.optional(),
  offset: z.number().int().optional(),
});

export type PostListParameters = z.infer<typeof PostListParametersSchema>;
export type PostListParameterInput = z.input<typeof PostListParametersSchema>;
export const PostListParametersSchema = ListParametersSchema.extend({
  author: IdsFilterSchema.optional(),
  author_exclude: IdsFilterSchema.optional(),
  categories: TermsFilterSchema.optional(),
  categories_exclude: TermsFilterSchema.optional(),
  context: ContextSchema.optional(),
  exclude: IdsFilterSchema.optional(),
  include: IdsFilterSchema.optional(),
  modified_before: DateFilterSchema.optional(),
  modified_after: DateFilterSchema.optional(),
  search: z.string().nonempty().optional(),
  slug: z.array(z.string()).optional(),
  status: z
    .union([z.array(PostStatusSchema), PostStatusSchema])
    .transform((x) => (Array.isArray(x) ? x : [x]))
    .optional(),
  sticky: z.boolean().optional(),
  tags: TermsFilterSchema.optional(),
  tags_exclude: TermsFilterSchema.optional(),
  tax_relation: OperatorSchema.optional(),
});
