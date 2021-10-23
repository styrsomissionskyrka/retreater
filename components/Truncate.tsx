import { styled } from 'styles/stitches.config';

export const Truncate = styled('span', {
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
