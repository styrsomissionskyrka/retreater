import { UrlObject } from 'url';

import { CellProps, Column } from 'react-table';

import { format, formatISO, formatRelative } from 'lib/utils/date-fns';
import { OrderStatusEnum, RetreatStatusEnum } from 'lib/graphql';
import { formatMoney } from 'lib/utils/money';
import { styled } from 'styles/stitches.config';

import { Link } from '../Link';
import * as Menu from '../Menu';
import { BrowserOnly } from '../BrowserOnly';
import { CopyInline } from '../CopyInline';
import { StatusIndicator } from '../StatusIndicator';
import { Time } from '../Time';
import { Truncate } from '../Truncate';
import { Progress } from '../Progress';

export function createStatusCell<T extends object>(config: Column<T>): Column<T> {
  return {
    ...config,
    Cell(props: CellProps<T, RetreatStatusEnum | OrderStatusEnum>) {
      return <StatusIndicator status={props.value} />;
    },
  };
}

const LinkCell = styled(Link, {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  '&:hover': {
    color: '$blue500',
  },
});

export function createLinkCell<T extends object>({
  getLink,
  ...config
}: Column<T> & { getLink: (row: T) => string | UrlObject }): Column<T> {
  return {
    ...config,
    Cell({ value, row }: CellProps<T, string>) {
      return (
        <LinkCell href={getLink(row.original)}>
          <Truncate>{value}</Truncate>
        </LinkCell>
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
        <Time dateTime={formatISO(value)} title={format(value, 'yyyy-MM-dd HH:mm')}>
          {format(value, dateFormat)}
        </Time>
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
        <Time dateTime={formatISO(value)} title={format(value, 'yyyy-MM-dd HH:mm')}>
          {formatRelative(value, base)}
        </Time>
      );
    },
  };
}

export function createDateRangeCell<T extends object>(config: Column<T>): Column<T> {
  return {
    ...config,
    Cell({ value }: CellProps<T, { start?: Date | number | null; end?: Date | number | null }>) {
      if (value.start == null) return null;
      let start = <Time dateTime={formatISO(value.start)}>{format(value.start, 'yyyy-MM-dd')}</Time>;

      if (value.end == null) return <p>{start}</p>;
      let end = <Time dateTime={formatISO(value.end)}>{format(value.end, 'yyyy-MM-dd')}</Time>;

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
      return <Progress progress={progress} total={total} />;
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
