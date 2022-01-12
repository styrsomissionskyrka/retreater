import { Block as BlockType } from '../../lib/api/schema';

interface BlockComponentProps {
  block: BlockType;
}

export type BlockComponent = React.FC<BlockComponentProps>;
