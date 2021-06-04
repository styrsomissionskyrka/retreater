/* eslint-disable jsx-a11y/anchor-is-valid */
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import React, { forwardRef } from 'react';

type LinkProps = Omit<NextLinkProps, 'as' | 'passHref'> &
  Omit<React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, 'href' | 'ref'>;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, replace, scroll, shallow, prefetch, locale, children, ...anchor }, ref) => {
    return (
      <NextLink href={href} replace={replace} scroll={scroll} shallow={shallow} prefetch={prefetch} locale={locale}>
        <a {...anchor} ref={ref}>
          {children}
        </a>
      </NextLink>
    );
  },
);
