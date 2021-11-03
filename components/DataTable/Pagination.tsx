import { UrlObject } from 'url';

import { useRouter } from 'next/router';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons';

import { PaginationFieldsFragment } from 'lib/graphql';
import { omit } from 'lib/utils/object';

import { VisuallyHidden } from '../VisuallyHidden';
import { Link } from '../Link';
import { useDataTable } from '.';

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
  let table = useDataTable();

  let current = meta.currentPage;
  let rangeStart = (current - 1) * meta.perPage + 1;
  let rangeEnd = Math.min(rangeStart + meta.perPage - 1, table.data.length);

  return (
    <div className="flex items-center justify-between border-t border-black h-16 !mt-0 px-2 leading-none">
      <p className="text-sm">
        Visar {rangeStart} - {rangeEnd} av {meta.totalItems} resultat
      </p>

      <div className="flex gap-4">
        <PaginationLink page={current - 1} disabled={!meta.hasPreviousPage}>
          <IconChevronLeft size={16} />
          <VisuallyHidden>Föregående</VisuallyHidden>
        </PaginationLink>

        <PaginationLink page={current + 1} disabled={!meta.hasNextPage}>
          <IconChevronRight size={16} />
          <VisuallyHidden>Nästa</VisuallyHidden>
        </PaginationLink>
      </div>
    </div>
  );
};

const PaginationLink: React.FC<{ page: number; disabled: boolean; className?: string }> = ({
  page,
  disabled,
  className,
  children,
}) => {
  const router = useRouter();

  if (disabled) {
    return (
      <span style={{ cursor: 'default' }} className={className}>
        {children}
      </span>
    );
  }

  let href: UrlObject = page === 1 ? { query: omit(router.query, 'page') } : { query: { ...router.query, page } };

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};
