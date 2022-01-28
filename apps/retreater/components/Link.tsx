/* eslint-disable no-restricted-imports, jsx-a11y/anchor-is-valid */
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

import * as config from '../lib/config';

export type LinkProps = Omit<NextLinkProps, 'as'> & Omit<JSX.IntrinsicElements['a'], keyof NextLinkProps>;

export const Link: React.FC<LinkProps> = ({
  href,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch,
  locale,
  children,
  ...props
}) => {
  if (isInternalHref(href)) {
    let sanitizedHref = sanitizeInternalHref(href);
    return (
      <NextLink
        href={sanitizedHref}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref={passHref}
        prefetch={prefetch}
        locale={locale}
      >
        <a {...props}>{children}</a>
      </NextLink>
    );
  }

  return (
    <a href={href.toString()} {...props}>
      {children}
    </a>
  );
};

function sanitizeInternalHref(href: LinkProps['href']) {
  if (typeof href === 'object') return href;
  let url = new URL(href, config.url.app.origin);
  return `${url.pathname}${url.search ? '?' + url.search : ''}`;
}

function isInternalHref(href: LinkProps['href']) {
  if (typeof href === 'object') return true;

  try {
    let url = new URL(href, config.url.app);
    return url.origin === config.url.app.origin || url.origin == config.url.api.origin;
  } catch (error) {
    return false;
  }
}
