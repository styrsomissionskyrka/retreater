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

export const Body: React.FC = () => {
  const { getTableBodyProps, rows, prepareRow, visibleColumns, renderExpandedRow, loading } = useDataTable();

  return (
    <UI.Body {...getTableBodyProps()}>
      {rows.length < 1 && loading ? (
        <UI.BodyRow>
          <UI.BodyCell colSpan={visibleColumns.length}>
            <div className="flex justify-center w-full">
              <Spinner size={24} />
            </div>
          </UI.BodyCell>
        </UI.BodyRow>
      ) : (
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
        })
      )}
    </UI.Body>
  );
};
