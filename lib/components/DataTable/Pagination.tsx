/* eslint-disable react/jsx-key */
import { useRouter } from 'next/router';
import { UrlObject } from 'url';
import { PaginationFragment } from 'lib/graphql';
import { Link } from '../Link';
import { useDataTable } from './Context';

interface Props {
  meta: PaginationFragment;
}

export const Pagination: React.FC<Props> = ({ meta }) => {
  const table = useDataTable();
  let current = toIndexOne(meta.currentPage);

  let rangeStart = meta.currentPage * meta.perPage + 1;
  let rangeEnd = rangeStart + Math.min(meta.perPage, table.rows.length) - 1;

  return (
    <div>
      <p>
        Visar {rangeStart} - {rangeEnd} av {meta.totalItems} resultat
      </p>

      <PaginationLink page={current - 1} disabled={!meta.hasPreviousPage}>
        Föregående
      </PaginationLink>

      <PaginationLink page={current + 1} disabled={!meta.hasNextPage}>
        Nästa
      </PaginationLink>
    </div>
  );
};

const PaginationLink: React.FC<{ page: number; disabled: boolean }> = ({ page, disabled, children }) => {
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
