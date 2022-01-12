import { Fragment } from 'react';

import { Block as BlockType } from '../../lib/api/schema';
import { renderBlock } from './render';

interface Props {
  blocks: BlockType[];
}

export const BlockRenderer: React.FC<Props> = ({ blocks }) => {
  return (
    <Fragment>
      {blocks.map((block, index) => (
        <Fragment key={index}>{renderBlock(block)}</Fragment>
      ))}
    </Fragment>
  );
};
