import Image from 'next/image';

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
  let className = 'rounded-full bg-gray-200 w-8 object-cover';

  return (
    <Link href={href} className="rounded-full flex aspect-1-1">
      {image ? (
        <Image src={image} width={32} height={32} alt={alt} className={className} />
      ) : (
        <div className={className} />
      )}
    </Link>
  );
};
