import { PaginationFragment } from 'lib/graphql';
import { useRouter } from 'next/router';
import { UrlObject } from 'url';
import { Link } from './Link';

interface Props {
  meta: PaginationFragment;
  itemsOnPage: number;
}

export const Pagination: React.FC<Props> = ({ meta, itemsOnPage }) => {
  let current = toIndexOne(meta.currentPage);

  let rangeStart = meta.currentPage * meta.perPage + 1;
  let rangeEnd = rangeStart + Math.min(meta.perPage, itemsOnPage) - 1;

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
    return <span>{children}</span>;
  }

  let href: UrlObject = page === 1 ? { pathname: router.pathname } : { query: { page } };
  return <Link href={href}>{children}</Link>;
};

function toIndexOne(next: number) {
  return next + 1;
}
