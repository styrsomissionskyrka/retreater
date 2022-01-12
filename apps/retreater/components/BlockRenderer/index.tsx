import { Fragment } from 'react';

import { Block as BlockType } from '../../lib/api/schema';
import { List } from './List';
import { Paragraph } from './Paragraph';
import { Quote } from './Quote';

interface Props {
  blocks: BlockType[];
}

export const BlockRenderer: React.FC<Props> = ({ blocks }) => {
  return (
    <Fragment>
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </Fragment>
  );
};

const Block: React.FC<{ block: BlockType }> = ({ block }) => {
  switch (block.blockName) {
    case 'core/paragraph':
      return <Paragraph block={block} />;
    case 'core/quote':
      return <Quote block={block} />;
    case 'core/list':
      return <List block={block} />;
    default:
      console.log(block.blockName);
      return null;
  }
};
