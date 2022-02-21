import { Block as BlockType } from '@smk/types';

interface BlockComponentProps {
  block: BlockType;
}

export type BlockComponent = React.FC<BlockComponentProps>;
