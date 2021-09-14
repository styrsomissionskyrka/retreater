/* eslint-disable jsx-a11y/anchor-is-valid, no-restricted-imports */
import classNames from 'classnames';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { useRouter } from 'next/router';
import React, { forwardRef } from 'react';

type LinkProps = Omit<NextLinkProps, 'as' | 'passHref'> &
  Omit<React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, 'href' | 'ref'>;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      replace,
      scroll,
      shallow,
      prefetch,
      locale,
      children,
      target,
      rel: passedRel,
      className = 'hover:text-blue-500',
      ...anchor
    },
    ref,
  ) => {
    let rel = passedRel;
    if (target === '_blank' && ref != null) {
      rel = 'noopener noreferrer';
    }

    return (
      <NextLink href={href} replace={replace} scroll={scroll} shallow={shallow} prefetch={prefetch} locale={locale}>
        <a {...anchor} ref={ref} target={target} rel={rel} className={className}>
          {children}
          {target === '_blank' ? ' ↗' : ''}
        </a>
      </NextLink>
    );
  },
);

Link.displayName = 'Link';

type NavLinkProps = LinkProps & { activeClassName?: string };

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, className: passedClassName, activeClassName, children, ...props }, ref) => {
    const router = useRouter();

    let h = typeof href === 'string' ? href : href.pathname ?? '';
    let isActive = router.asPath.split('?')[0] === h;
    let passedClass = classNames(passedClassName, isActive && activeClassName);

    return (
      <Link {...props} ref={ref} href={href} className={passedClass} data-active={isActive}>
        {children}
      </Link>
    );
  },
);

NavLink.displayName = 'NavLink';
