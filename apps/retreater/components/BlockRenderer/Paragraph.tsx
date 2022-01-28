import * as z from 'zod';

import { HTML } from './Html';
import { BlockComponent } from './types';
import {
  NonEmptyString,
  StyledBlockAttributes,
  useBlockAttributes,
  getStyleFromAttributes,
} from './utils';

const ParagraphAttributes = StyledBlockAttributes.extend({
  content: NonEmptyString.optional(),
  direction: NonEmptyString.optional(),
  dropCap: z.boolean().optional(),
  placeholder: NonEmptyString.optional(),
});

export const Paragraph: BlockComponent = ({ block }) => {
  let attributes = useBlockAttributes(block, ParagraphAttributes);
  let style = getStyleFromAttributes(attributes);

  return (
    <p id={attributes.anchor} className={attributes.className} style={style}>
      <HTML html={attributes.content} />
    </p>
  );
};
