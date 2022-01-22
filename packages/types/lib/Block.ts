import * as z from 'zod';

import * as utils from './utils';

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
    attrs: utils.emptyArrayToObject,
    blockName: z.string(),
    innerBlocks: z.array(BlockSchema),
    innerContent: z.array(z.union([z.string(), z.null()])),
    innerHTML: z.string(),
    rendered: z.string(),
  }),
);
