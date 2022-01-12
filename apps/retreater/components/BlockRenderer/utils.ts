import { useMemo } from 'react';
import * as z from 'zod';

import { Block } from '../../lib/api/schema';

export const NonEmptyString = z
  .string()
  .transform((x) => (x === '' ? undefined : x));

export function useBlockAttributes<
  Schema extends z.ZodSchema<any>,
  Output = z.infer<Schema>,
>(block: Block, schema: Schema) {
  let value = useMemo(() => {
    let result = schema.safeParse(block.attrs);
    if (result.success) return result.data;
    return {};
  }, [block.attrs, schema]);

  return value as Output;
}

export const BlockAttributes = z.object({
  align: NonEmptyString.optional(),
  anchor: NonEmptyString.optional(),
  className: NonEmptyString.optional(),
});

const StyleSchema = z.object({
  typography: z.object({ fontSize: NonEmptyString.optional() }).optional(),
  color: z
    .object({
      text: NonEmptyString.optional(),
      background: NonEmptyString.optional(),
    })
    .optional(),
});

export const StyledBlockAttributes = BlockAttributes.extend({
  backgroundColor: NonEmptyString.optional(),
  fontSize: NonEmptyString.optional(),
  textColor: NonEmptyString.optional(),
  style: z
    .union([z.array(z.unknown()), StyleSchema])
    .transform((x) => (Array.isArray(x) ? {} : x))
    .optional(),
});
