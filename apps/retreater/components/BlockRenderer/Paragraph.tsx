import * as z from 'zod';

import * as theme from '../../styles/theme';
import { BlockComponent } from './types';
import {
  NonEmptyString,
  StyledBlockAttributes,
  useBlockAttributes,
} from './utils';

const ParagraphAttributes = StyledBlockAttributes.extend({
  content: NonEmptyString.optional(),
  direction: NonEmptyString.optional(),
  dropCap: z.boolean().optional(),
  placeholder: NonEmptyString.optional(),
});

export const Paragraph: BlockComponent = ({ block }) => {
  let attributes = useBlockAttributes(block, ParagraphAttributes);

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
  let fontSize = theme.get(
    'fontSize',
    String(attributes.fontSize),
    attributes.style?.typography?.fontSize,
  );

  return (
    <p
      id={attributes.anchor}
      className={attributes.className}
      style={{ color, backgroundColor, fontSize }}
      dangerouslySetInnerHTML={{ __html: attributes.content ?? '' }}
    />
  );
};
