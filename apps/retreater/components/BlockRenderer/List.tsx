import * as z from 'zod';

import { BlockComponent } from './types';
import {
  NonEmptyString,
  StyledBlockAttributes,
  useBlockAttributes,
  useBlockStyles,
} from './utils';

const ListAttributes = StyledBlockAttributes.extend({
  ordered: z.boolean().optional(),
  placeholder: NonEmptyString.optional(),
  reversed: z.boolean().optional(),
  start: z.number().optional(),
  type: NonEmptyString.optional(),
  values: NonEmptyString.optional(),
});

export const List: BlockComponent = ({ block }) => {
  let attributes = useBlockAttributes(block, ListAttributes);
  let style = useBlockStyles(attributes);

  const Component = attributes.ordered ? 'ol' : 'ul';
  return (
    <Component
      id={attributes.anchor}
      className={attributes.className}
      start={attributes.start}
      reversed={attributes.reversed}
      style={style}
      dangerouslySetInnerHTML={{ __html: attributes.values ?? '' }}
    />
  );
};
