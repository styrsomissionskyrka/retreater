import Image from 'next/image';

import { styled } from 'styles/stitches.config';

export const Avatar = styled(Image, { borderRadius: '$full', background: '$gray100' });
