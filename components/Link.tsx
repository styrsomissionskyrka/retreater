/* eslint-disable no-restricted-imports, jsx-a11y/anchor-is-valid */
import NextLink, { LinkProps } from 'next/link';

export const Link: React.FC<LinkProps> = ({ children, ...props }) => {
  return (
    <NextLink {...props}>
      <a>{children}</a>
    </NextLink>
  );
};
