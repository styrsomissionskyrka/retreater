import { HTML, Replacements } from './Html';
import { BlockComponent } from './types';
import { BlockAttributes, NonEmptyString, useBlockAttributes } from './utils';

const QuoteAttributes = BlockAttributes.extend({
  citation: NonEmptyString.optional(),
  value: NonEmptyString.optional(),
});

export const Quote: BlockComponent = ({ block }) => {
  let attributes = useBlockAttributes(block, QuoteAttributes);
  return (
    <blockquote id={attributes.anchor} className={attributes.className}>
      <HTML html={attributes.value} replacements={replacements} />
      <cite>{attributes.citation}</cite>
    </blockquote>
  );
};

const replacements: Replacements = { cite: false };
