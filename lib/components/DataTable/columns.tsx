import { CellProps, Column } from 'react-table';
import classNames from 'classnames';
import { RetreatStatusEnum } from 'lib/graphql';
import { Link } from '../Link';
import { format, formatRelative } from 'lib/utils/date-fns';
import { UrlObject } from 'url';
import { assert } from 'lib/utils/assert';

export function createStatusCell<T extends { status: RetreatStatusEnum }>(): Column<T> {
  const colorMap: Record<RetreatStatusEnum, string> = {
    [RetreatStatusEnum.Archived]: 'bg-gray-300',
    [RetreatStatusEnum.Draft]: 'bg-yellow-500',
    [RetreatStatusEnum.Published]: 'bg-green-500',
  };
  return {
    accessor: 'status',
    Header: '',
    Cell(props: CellProps<T, RetreatStatusEnum>) {
      return (
        <div className="flex items-center justify-center text-center">
          <span className={classNames(colorMap[props.value], 'block w-2 h-2 rounded-full')} />
        </div>
      );
    },
  };
}

export function createLinkCell<T extends object>({
  getLink,
  ...config
}: Column<T> & { getLink: (row: T) => string | UrlObject }): Column<T> {
  return {
    ...config,
    Cell({ value, row }: CellProps<T, string>) {
      return <Link href={getLink(row.original)}>{value}</Link>;
    },
  };
}

export function createFormattedDateCell<T extends object>({
  dateFormat,
  ...config
}: Column<T> & { dateFormat: string }): Column<T> {
  return {
    ...config,
    Cell({ value }: CellProps<T, Date | number>) {
      return <span>{format(value, dateFormat)}</span>;
    },
  };
}

export function createRelativeDateCell<T extends object>({
  base = new Date(),
  ...config
}: Column<T> & { base?: Date | number }): Column<T> {
  return {
    ...config,
    Cell({ value }: CellProps<T, Date | number>) {
      return <span>{formatRelative(value, base)}</span>;
    },
  };
}

export function createDateRangeCell<T extends object>(config: Column<T>): Column<T> {
  return {
    ...config,
    Cell({ value }: CellProps<T, { start: Date | number; end: Date | number }>) {
      assert(value.start != null);
      assert(value.end != null);

      return (
        <p>
          <span>{format(value.start, 'yyyy-MM-dd')}</span>
          <span>{' - '}</span>
          <span>{format(value.end, 'yyyy-MM-dd')}</span>
        </p>
      );
    },
  };
}
