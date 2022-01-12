import { useMemo } from 'react';
import * as z from 'zod';

import * as theme from '../../styles/theme';
import { Block } from '../../lib/api/schema';

export const NonEmptyString = z
  .string()
  .transform((x) => (x === '' ? undefined : x));

export function useBlockAttributes<
  Schema extends z.ZodSchema<any>,
  Output = z.infer<Schema>,
>(block: Block, schema: Schema) {
  let value = useMemo(() => {
    return schema.safeParse(block.attrs);
  }, [block.attrs, schema]);

  if (value.success) return value.data as Output;
  return {} as Output;
}

export function useBlockStyles(
  attributes: TStyledBlockAttributes,
): React.CSSProperties {
  let color = theme.get(
    'color',
    attributes.textColor,
    attributes.style?.color?.text,
  );

  let backgroundColor = theme.get(
    'color',
    attributes.backgroundColor,
    attributes.style?.color?.background,
  );

  let gradient = theme.get('gradient', attributes.gradient);

  let fontSize = theme.get(
    'fontSize',
    String(attributes.fontSize),
    attributes.style?.typography?.fontSize,
  );

  return { color, background: gradient ?? backgroundColor, fontSize };
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

type TStyledBlockAttributes = z.infer<typeof StyledBlockAttributes>;
export const StyledBlockAttributes = BlockAttributes.extend({
  backgroundColor: NonEmptyString.optional(),
  fontSize: NonEmptyString.optional(),
  textColor: NonEmptyString.optional(),
  gradient: NonEmptyString.optional(),
  style: z
    .union([z.array(z.unknown()), StyleSchema])
    .transform((x) => (Array.isArray(x) ? {} : x))
    .optional(),
});
