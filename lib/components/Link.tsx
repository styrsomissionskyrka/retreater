/* eslint-disable jsx-a11y/anchor-is-valid */
// eslint-disable-next-line no-restricted-imports
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { useRouter } from 'next/router';
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

Link.displayName = 'Link';

type NavLinkProps = LinkProps & { activeClassName?: string };

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, className, activeClassName, children, ...props }, ref) => {
    const router = useRouter();

    let h = typeof href === 'string' ? href : href.pathname ?? '';
    let isActive = router.asPath.startsWith(h);
    let c = [className, isActive ? activeClassName : ''].join(' ').trim();

    return (
      <Link {...props} href={href} className={c}>
        {children}
      </Link>
    );
  },
);

NavLink.displayName = 'NavLink';
