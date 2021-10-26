import { Fragment } from 'react';
import { ExpandedRowOptions, RenderExpandedRow, Row } from 'react-table';

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
  const { getTableBodyProps, rows, prepareRow, visibleColumns, renderExpandedRow, expandedRowOptions, loading } =
    useDataTable();

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
          <UI.BodyCell colSpan={visibleColumns.length} full>
            <div>{loadingMessage}</div>
          </UI.BodyCell>
        </UI.BodyRow>
      )}

      {state === 'empty' && (
        <UI.BodyRow>
          <UI.BodyCell colSpan={visibleColumns.length} full>
            <div>{emptyMessage}</div>
          </UI.BodyCell>
        </UI.BodyRow>
      )}

      {state === 'idle' &&
        rows.map((row) => {
          prepareRow(row);
          let { key, ...rowProps } = row.getRowProps();

          return (
            <Fragment key={key}>
              <UI.BodyRow {...rowProps} expanded={row.isExpanded ? 'parent' : undefined}>
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
                <ExpandedRow
                  row={row}
                  columnCount={visibleColumns.length}
                  renderExpandedRow={renderExpandedRow}
                  expandedRowOptions={expandedRowOptions}
                />
              ) : null}
            </Fragment>
          );
        })}
    </UI.Body>
  );
};

type ExpandedRowProps<T extends object> = {
  row: Row<T>;
  columnCount: number;
  renderExpandedRow: RenderExpandedRow<T>;
  expandedRowOptions?: ExpandedRowOptions;
};

const ExpandedRow: React.FC<ExpandedRowProps<{}>> = ({ row, columnCount, renderExpandedRow, expandedRowOptions }) => {
  let maxSpan = columnCount - 1;
  let span = Math.min(expandedRowOptions?.span ?? maxSpan, maxSpan);
  let fill = Array.from({ length: maxSpan - span }, (_, index) => <UI.BodyCell key={index} />);
  return (
    <UI.BodyRow expanded="child">
      <UI.BodyCell />
      <UI.BodyCell colSpan={span}>{renderExpandedRow(row)}</UI.BodyCell>
      {fill}
    </UI.BodyRow>
  );
};
