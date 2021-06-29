import { Fragment } from 'react';
import classNames from 'classnames';

import { Spinner } from '../Spinner';
import * as UI from '../Table';
import { useDataTable } from './Context';

export const Table: React.FC = ({ children }) => {
  const { getTableProps } = useDataTable();
  return <UI.Table {...getTableProps()}>{children}</UI.Table>;
};

export const Head: React.FC = () => {
  const { headerGroups } = useDataTable();
  return (
    <UI.Head>
      {headerGroups.map((headerGroup) => {
        let { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
        return (
          <UI.HeadRow {...headerGroupProps} key={key}>
            {headerGroup.headers.map((column) => {
              let { key, ...headerProps } = column.getHeaderProps();
              return (
                <UI.HeadCell {...headerProps} key={key}>
                  {column.render('Header')}
                </UI.HeadCell>
              );
            })}
          </UI.HeadRow>
        );
      })}
    </UI.Head>
  );
};

interface BodyProps {
  loading?: React.ReactNode;
  empty?: React.ReactNode;
}

export const Body: React.FC<BodyProps> = ({
  loading: loadingMessage = <Spinner size={24} />,
  empty: emptyMessage = 'Ingen data.',
}) => {
  const { getTableBodyProps, rows, prepareRow, visibleColumns, renderExpandedRow, loading } = useDataTable();

  let state: 'loading' | 'empty' | 'idle' = 'idle';
  if (rows.length < 1 && loading) {
    state = 'loading';
  } else if (rows.length < 1) {
    state = 'empty';
  }

  return (
    <UI.Body {...getTableBodyProps()}>
      {state === 'loading' && (
        <UI.BodyRow>
          <UI.BodyCell colSpan={visibleColumns.length}>
            <div className="flex justify-center w-full">{loadingMessage}</div>
          </UI.BodyCell>
        </UI.BodyRow>
      )}

      {state === 'empty' && (
        <UI.BodyRow>
          <UI.BodyCell colSpan={visibleColumns.length}>
            <div className="flex justify-center w-full">{emptyMessage}</div>
          </UI.BodyCell>
        </UI.BodyRow>
      )}

      {state === 'idle' &&
        rows.map((row) => {
          prepareRow(row);
          let { key, ...rowProps } = row.getRowProps();
          return (
            <Fragment key={key}>
              <UI.BodyRow {...rowProps} className={classNames(row.isExpanded && 'bg-gray-100')}>
                {row.cells.map((cell) => {
                  let { key, ...cellProps } = cell.getCellProps();
                  return (
                    <UI.BodyCell {...cellProps} key={key}>
                      {cell.render('Cell')}
                    </UI.BodyCell>
                  );
                })}
              </UI.BodyRow>

              {row.isExpanded && typeof renderExpandedRow === 'function' ? (
                <UI.BodyRow {...rowProps} className="!border-t-0 bg-gray-100">
                  <UI.BodyCell />
                  <UI.BodyCell colSpan={visibleColumns.length - 1}>{renderExpandedRow(row)}</UI.BodyCell>
                </UI.BodyRow>
              ) : null}
            </Fragment>
          );
        })}
    </UI.Body>
  );
};
