import { Fragment } from 'react';
import * as z from 'zod';

import { renderBlock } from './render';
import { BlockComponent } from './types';
import {
  StyledBlockAttributes,
  useBlockAttributes,
  getStyleFromAttributes,
} from './utils';

const ColumnsAttributes = StyledBlockAttributes.extend({});

export const Columns: BlockComponent = ({ block }) => {
  let attributes = useBlockAttributes(block, ColumnsAttributes);
  let style = getStyleFromAttributes(attributes);

  return (
    <div id={attributes.anchor} className={attributes.className} style={style}>
      {block.innerBlocks.map((innerBlock, index) => (
        <Column key={index} block={innerBlock} />
      ))}
    </div>
  );
};

const ColumnAttributes = StyledBlockAttributes.extend({
  templateLock: z.unknown().optional(),
  verticalAlignment: z.unknown().optional(),
  width: z.unknown().optional(),
});

const Column: BlockComponent = ({ block }) => {
  let attributes = useBlockAttributes(block, ColumnAttributes);
  let style = getStyleFromAttributes(attributes);

  return (
    <div id={attributes.anchor} className={attributes.className} style={style}>
      {block.innerBlocks.map((innerBlock, index) => (
        <Fragment key={index}>{renderBlock(innerBlock)}</Fragment>
      ))}
    </div>
  );
};
