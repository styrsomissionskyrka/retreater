import React, { useMemo } from 'react';
import * as z from 'zod';
import { Block } from '@styrsomissionskyrka/types';

import * as theme from '../../styles/theme';

export const NonEmptyString = z.string().transform((x) => (x === '' ? undefined : x));

export function useBlockAttributes<Schema extends z.ZodSchema<any>, Output = z.infer<Schema>>(
  block: Block,
  schema: Schema,
) {
  let value = useMemo(() => {
    return schema.safeParse(block.attrs);
  }, [block.attrs, schema]);

  if (value.success) return value.data as Output;
  return {} as Output;
}

export function getStyleFromAttributes(attributes: TStyledBlockAttributes): React.CSSProperties {
  let color = theme.get('color', attributes.textColor, attributes.style?.color?.text);
  let backgroundColor = theme.get('color', attributes.backgroundColor, attributes.style?.color?.background);
  let gradient = theme.get('gradient', attributes.gradient);
  let fontSize = theme.get('fontSize', String(attributes.fontSize), attributes.style?.typography?.fontSize);

  return { color, background: gradient ?? backgroundColor, fontSize };
}

export function getStyleFromClassName(className?: string | null): React.CSSProperties {
  if (className == null || className == '') return {};

  let style: React.CSSProperties = {};
  for (let c of className.split(' ')) {
    let colorMatch = /has-(?<color>.+)-color/g.exec(c);
    if (colorMatch?.groups?.color != null) {
      style.color = theme.get('color', colorMatch.groups.color);
      continue;
    }

    let roundedMatch = c === 'is-style-rounded';
    if (roundedMatch) {
      style.borderRadius = '100%';
      continue;
    }
  }

  return style;
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
