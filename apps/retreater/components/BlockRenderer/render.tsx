import { Block } from '../../lib/api/schema';
import { Columns } from './Columns';
import { Heading } from './Heading';
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

    default:
      console.log(block.blockName);
      return null;
  }
}
