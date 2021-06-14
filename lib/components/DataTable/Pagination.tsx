/* eslint-disable react/jsx-key */
import { UrlObject } from 'url';

import { useRouter } from 'next/router';

import { PaginationFieldsFragment, PageInfoFieldsFragment } from 'lib/graphql';

import { Link } from '../Link';
import { useDataTable } from './Context';

interface Props {
  // meta: PaginationFieldsFragment;
  pageInfo: PageInfoFieldsFragment;
}

export const Pagination: React.FC<Props> = ({ pageInfo }) => {
  const table = useDataTable();
  // let current = toIndexOne(meta.currentPage);

  // let rangeStart = meta.currentPage * meta.perPage + 1;
  // let rangeEnd = rangeStart + Math.min(meta.perPage, table.rows.length) - 1;

  return (
    <div className="flex space-x-8">
      {/* <span>
        Visar {rangeStart} - {rangeEnd} av {meta.totalItems} resultat
      </span> */}

      <PaginationLink cursor={pageInfo.startCursor} disabled={!pageInfo.hasPreviousPage}>
        Föregående
      </PaginationLink>

      <PaginationLink cursor={pageInfo.endCursor} disabled={!pageInfo.hasNextPage}>
        Nästa
      </PaginationLink>
    </div>
  );
};

const PaginationLink: React.FC<{ cursor?: string; disabled?: boolean }> = ({ cursor, disabled, children }) => {
  const router = useRouter();

  if (disabled) {
    return <span className="cursor-default">{children}</span>;
  }

  let href: UrlObject = page === 1 ? { pathname: router.pathname } : { query: { page } };
  return <Link href={href}>{children}</Link>;
};

function toIndexOne(next: number) {
  return next + 1;
}
