import { UrlObject } from 'url';

import { CellProps, Column } from 'react-table';
import classNames from 'classnames';

import { format, formatISO, formatRelative } from 'lib/utils/date-fns';

import { Link, Menu } from '../';

type Status = 'active' | 'inactive' | 'indeterminate';

export function createStatusCell<T extends object>({
  isIndeterminate,
  ...config
}: Column<T> & { isIndeterminate?: (o: T) => boolean }): Column<T> {
  const colorMap: Record<Status, string> = {
    inactive: 'bg-gray-300',
    indeterminate: 'bg-yellow-500',
    active: 'bg-green-500',
  };

  return {
    ...config,
    Cell(props: CellProps<T, boolean>) {
      let status: Status;
      if (typeof isIndeterminate === 'function' && isIndeterminate(props.row.original)) {
        status = 'indeterminate';
      } else if (props.value) {
        status = 'active';
      } else {
        status = 'inactive';
      }

      return (
        <div className="flex items-center justify-center text-center">
          <span className={classNames(colorMap[status], 'block w-2 h-2 rounded-full')} />
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
    Cell({ value }: CellProps<T, { start?: Date | number | null; end?: Date | number | null }>) {
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

type MenuCellProps<T extends object> = Column<T> & { actions: { label: React.ReactNode; onClick: (row: T) => void }[] };

export function createContextMenuCell<T extends object>({ actions, ...config }: MenuCellProps<T>): Column<T> {
  return {
    ...config,
    Cell({ row }: CellProps<T, unknown>) {
      return (
        <Menu.Wrapper>
          <Menu.ContextButton />
          <Menu.Actions>
            {actions.map((action, i) => (
              <Menu.Action key={i} onClick={() => action.onClick(row.original)}>
                {action.label}
              </Menu.Action>
            ))}
          </Menu.Actions>
        </Menu.Wrapper>
      );
    },
  };
}
