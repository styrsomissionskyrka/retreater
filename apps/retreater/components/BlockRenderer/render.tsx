import { Block } from '@styrsomissionskyrka/types';

import { Columns } from './Columns';
import { Heading } from './Heading';
import { Image as ImageBlock } from './Image';
import { List } from './List';
import { Paragraph } from './Paragraph';
import { Quote } from './Quote';

export function renderBlock(block: Block) {
  switch (block.blockName) {
    case 'core/paragraph':
      return <Paragraph block={block} />;

    case 'core/quote':
      return <Quote block={block} />;

    case 'core/list':
      return <List block={block} />;

    case 'core/columns':
      return <Columns block={block} />;

    case 'core/heading':
      return <Heading block={block} />;

    case 'core/image':
      return <ImageBlock block={block} />;

    default:
      console.warn(`No implementation for block ${block.blockName}`);
      return null;
  }
}
