import { UrlObject } from 'url';

import { useRouter } from 'next/router';
import { IconAdjustments, IconChevronLeft, IconChevronRight } from '@tabler/icons';
import { Fragment, useState } from 'react';

import { PaginationFieldsFragment } from 'lib/graphql';
import { omit } from 'lib/utils/object';

import { Dialog, Title } from '../Dialog';
import { VisuallyHidden } from '../VisuallyHidden';
import { Link } from '../Link';
import { Button } from '../Button';
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
  totalItems: 0,
};

export const Pagination: React.FC<Props> = ({ meta = defaultMeta, children }) => {
  let table = useDataTable();

  let [filtersOpen, setFiltersOpen] = useState(false);

  let current = meta.currentPage;
  let rangeStart = Math.min((current - 1) * meta.perPage + 1, table.data.length);
  let rangeEnd = Math.min(rangeStart + meta.perPage - 1, table.data.length);

  return (
    <div className="flex items-center space-x-4 border-t border-black h-16 !mt-0 px-2 leading-none">
      {children != null ? (
        <Fragment>
          <Button
            aria-label="Redigera filter"
            variant="outline"
            square
            size="small"
            onClick={() => setFiltersOpen(true)}
          >
            <IconAdjustments size={16} />
          </Button>
          <Dialog mode="sidebar" isOpen={filtersOpen} onDismiss={() => setFiltersOpen(false)}>
            <Title>Filter</Title>
            {children}
          </Dialog>
        </Fragment>
      ) : null}

      <p className="text-sm">
        Visar {rangeStart} - {rangeEnd} av {meta.totalItems} resultat
      </p>

      <div className="flex gap-4 !ml-auto">
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
