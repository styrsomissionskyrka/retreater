import * as z from 'zod';

import { BlockComponent } from './types';
import {
  NonEmptyString,
  StyledBlockAttributes,
  useBlockAttributes,
  useBlockStyles,
} from './utils';

const HeadingAttributes = StyledBlockAttributes.extend({
  content: NonEmptyString.optional(),
  level: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
  ]),
});

export const Heading: BlockComponent = ({ block }) => {
  let attributes = useBlockAttributes(block, HeadingAttributes);
  let style = useBlockStyles(attributes);

  const Component: `h${typeof attributes.level}` = `h${attributes.level}`;

  return (
    <Component
      id={attributes.anchor}
      className={attributes.className}
      style={style}
      dangerouslySetInnerHTML={{ __html: attributes.content ?? '' }}
    />
  );
};
