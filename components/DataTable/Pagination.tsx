import { UrlObject } from 'url';

import { useRouter } from 'next/router';

import { PaginationFieldsFragment } from 'lib/graphql';
import { omit } from 'lib/utils/object';
import { styled } from 'styles/stitches.config';

import { Link } from '../Link';

interface Props {
  meta?: PaginationFieldsFragment;
}

const defaultMeta: PaginationFieldsFragment = {
  hasNextPage: false,
  hasPreviousPage: false,
  currentPage: 1,
  perPage: 1,
  totalPages: 1,
  totalItems: 1,
};

export const Pagination: React.FC<Props> = ({ meta = defaultMeta }) => {
  let current = meta.currentPage;
  let rangeStart = (current - 1) * meta.perPage + 1;
  let rangeEnd = rangeStart + meta.perPage - 1;

  return (
    <Wrapper>
      <span>
        Visar {rangeStart} - {rangeEnd} av {meta.totalItems} resultat
      </span>

      <PaginationLink page={current - 1} disabled={!meta.hasPreviousPage}>
        Föregående
      </PaginationLink>

      <PaginationLink page={current + 1} disabled={!meta.hasNextPage}>
        Nästa
      </PaginationLink>
    </Wrapper>
  );
};

const PaginationLink: React.FC<{ page: number; disabled: boolean }> = ({ page, disabled, children }) => {
  const router = useRouter();

  if (disabled) {
    return <span style={{ cursor: 'default' }}>{children}</span>;
  }

  let href: UrlObject =
    page === 1
      ? { pathname: router.pathname, query: omit(router.query, 'page') }
      : { pathname: router.pathname, query: { ...router.query, page } };
  return <Link href={href}>{children}</Link>;
};

const Wrapper = styled('div', {
  display: 'flex',
  spaceX: '$8',
});
