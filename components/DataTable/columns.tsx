import { UrlObject } from 'url';

import { CellProps, Column } from 'react-table';
import classNames from 'classnames';
import { useState } from 'react';

import { format, formatISO, formatRelative } from 'lib/utils/date-fns';
import { OrderStatusEnum, RetreatStatusEnum } from 'lib/graphql';
import { formatMoney } from 'lib/utils/money';
import { statusColorMap } from 'lib/utils/colors';

import { Link, Menu, BrowserOnly, CopyInline } from '..';

export function createStatusCell<T extends object>(config: Column<T>): Column<T> {
  return {
    ...config,
    Cell(props: CellProps<T, RetreatStatusEnum | OrderStatusEnum>) {
      return (
        <div className="flex items-center justify-center text-center">
          <span className={classNames(statusColorMap[props.value], 'block w-2 h-2 rounded-full')} />
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
          <span className="truncate">{value}</span>
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
        <p className="tabular-nums">
          {start}
          <span>{' - '}</span>
          {end}
        </p>
      );
    },
  };
}

type MenuCellProps<T extends object> = Column<T> & {
  actions: { label: React.ReactNode; onClick: (row: T) => void; disabled?: boolean | ((row: T) => boolean) }[];
};

export function createContextMenuCell<T extends object>({ actions, ...config }: MenuCellProps<T>): Column<T> {
  return {
    ...config,
    Cell({ row }: CellProps<T, unknown>) {
      return (
        <Menu.Wrapper>
          <Menu.ContextButton />
          <Menu.Actions>
            {actions.map((action, i) => (
              <Menu.Action
                key={i}
                onClick={() => action.onClick(row.original)}
                disabled={typeof action.disabled === 'function' ? action.disabled(row.original) : action.disabled}
              >
                {action.label}
              </Menu.Action>
            ))}
          </Menu.Actions>
        </Menu.Wrapper>
      );
    },
  };
}

interface CurrencyCellData {
  amount?: number | null;
  currency?: string | null;
}

export function createCurrencyCell<T extends CurrencyCellData>({
  getData,
  ...config
}: Column<T> & { getData?: (item: T) => CurrencyCellData }): Column<T> {
  return {
    ...config,
    Cell(props: CellProps<T, unknown>) {
      let { amount, currency } = getData ? getData(props.row.original) : props.row.original;
      if (amount == null || currency == null) return 'Inte tillgängligt';
      return <BrowserOnly>{formatMoney(amount, currency)}</BrowserOnly>;
    },
  };
}

export function createProgressCell<T extends object>({
  getProgress,
  ...config
}: Column<T> & { getProgress: (item: T) => { progress: number; total: number } }): Column<T> {
  return {
    ...config,
    Cell(props: CellProps<T, unknown>) {
      let { progress, total } = getProgress(props.row.original);
      let [isHovering, setIsHovering] = useState(false);

      return (
        <div
          className="w-full h-full relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {!isHovering ? (
            <div className="w-full h-full absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-2 rounded border border-black overflow-hidden">
                <div className="h-full bg-black" style={{ width: `calc(100% * (${progress} / ${total}))` }} />
              </div>
            </div>
          ) : (
            <div className="w-full h-full absolute inset-0 flex items-center justify-center tabular-nums">
              {progress} / {total}
            </div>
          )}
        </div>
      );
    },
  };
}

export function createCopyCell<T extends object>(config: Column<T>): Column<T> {
  return {
    ...config,
    Cell(props: CellProps<T, string>) {
      return <CopyInline value={props.value}>{props.value}</CopyInline>;
    },
  };
}
