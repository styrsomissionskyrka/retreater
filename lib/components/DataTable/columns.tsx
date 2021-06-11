import { UrlObject } from 'url';

import { CellProps, Column } from 'react-table';
import classNames from 'classnames';

import { RetreatStatusEnum } from 'lib/graphql';
import { format, formatISO, formatRelative } from 'lib/utils/date-fns';

import { Link } from '../Link';

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
      return (
        <Link href={getLink(row.original)} className="flex items-center w-full h-full hover:text-blue-500">
          {value}
        </Link>
      );
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
      return (
        <time dateTime={formatISO(value)} title={format(value, 'yyyy-MM-dd HH:mm')}>
          {format(value, dateFormat)}
        </time>
      );
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
      return (
        <time dateTime={formatISO(value)} title={format(value, 'yyyy-MM-dd HH:mm')}>
          {formatRelative(value, base)}
        </time>
      );
    },
  };
}

export function createDateRangeCell<T extends object>(config: Column<T>): Column<T> {
  return {
    ...config,
    Cell({ value }: CellProps<T, { start: Date | number; end: Date | number }>) {
      if (value.start == null) return null;
      let start = <time dateTime={formatISO(value.start)}>{format(value.start, 'yyyy-MM-dd')}</time>;

      if (value.end == null) return <p>{start}</p>;
      let end = <time dateTime={formatISO(value.end)}>{format(value.end, 'yyyy-MM-dd')}</time>;

      return (
        <p>
          {start}
          <span>{' - '}</span>
          {end}
        </p>
      );
    },
  };
}
