import Image from 'next/image';

import { styled } from 'styles/stitches.config';

import { Link } from './Link';

export interface AvatarProps {
  id: string;
  image?: string;
  alt?: string;
  href?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  id,
  image,
  alt = '',
  href = `/admin/anvandare/${encodeURIComponent(id)}`,
}) => {
  return (
    <AvatarLink href={href}>
      {image ? <Img src={image} width={32} height={32} alt={alt} /> : <Img as="div" />}
    </AvatarLink>
  );
};

const AvatarLink = styled(Link, { borderRadius: '$full', display: 'flex' });
const Img = styled(Image, { borderRadius: '$full', background: '$gray200', width: 32, aspectRatio: '1 / 1' });
