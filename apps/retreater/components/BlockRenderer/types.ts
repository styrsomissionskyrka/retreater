import { Block as BlockType } from '@styrsomissionskyrka/types';

interface BlockComponentProps {
  block: BlockType;
}

export type BlockComponent = React.FC<BlockComponentProps>;
