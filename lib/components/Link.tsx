import { forwardRef } from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

import { ElementProps } from 'lib/types/utils';

type LinkProps = NextLinkProps & ElementProps<'a'>;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      children,
      href,
      as,
      replace,
      scroll,
      shallow,
      passHref,
      prefetch,
      locale,
      ...props
    },
    ref,
  ) => {
    const rel =
      props.rel ?? props.target === '_blank'
        ? 'noreferrer noopener'
        : undefined;

    return (
      <NextLink
        href={href}
        as={as}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref={passHref}
        prefetch={prefetch}
        locale={locale}
      >
        <a {...props} ref={ref} className={props.className} rel={rel}>
          {children}
        </a>
      </NextLink>
    );
  },
);

Link.displayName = 'Link';
