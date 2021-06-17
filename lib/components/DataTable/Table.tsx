/* eslint-disable react/jsx-key */
import { Fragment } from 'react';

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
      {headerGroups.map((headerGroup) => (
        <UI.HeadRow {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            <UI.HeadCell {...column.getHeaderProps()}>{column.render('Header')}</UI.HeadCell>
          ))}
        </UI.HeadRow>
      ))}
    </UI.Head>
  );
};

export const Body: React.FC = () => {
  const { getTableBodyProps, rows, prepareRow, visibleColumns, renderExpandedRow } = useDataTable();
  return (
    <UI.Body {...getTableBodyProps()}>
      {rows.map((row) => {
        prepareRow(row);
        let { key, ...rowProps } = row.getRowProps();
        return (
          <Fragment key={key}>
            <UI.BodyRow {...rowProps}>
              {row.cells.map((cell) => {
                return <UI.BodyCell {...cell.getCellProps()}>{cell.render('Cell')}</UI.BodyCell>;
              })}
            </UI.BodyRow>
            {row.isExpanded && typeof renderExpandedRow === 'function' ? (
              <UI.BodyRow {...rowProps}>
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
