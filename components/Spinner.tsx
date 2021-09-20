import { IconLoader } from '@tabler/icons';

import { styled, keyframes } from 'styles/stitches.config';

const spin = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

export const Spinner = styled(IconLoader, {
  animation: `${spin} 1s linear infinite`,
  variants: {
    reverse: {
      true: { animationDirection: 'reverse' },
    },
  },
});
