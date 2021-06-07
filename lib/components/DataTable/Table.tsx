/* eslint-disable react/jsx-key */
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
  const { getTableBodyProps, rows, prepareRow } = useDataTable();

  return (
    <UI.Body {...getTableBodyProps()}>
      {rows.map((row) => {
        prepareRow(row);
        return (
          <UI.BodyRow {...row.getRowProps()}>
            {row.cells.map((cell) => {
              return <UI.BodyCell {...cell.getCellProps()}>{cell.render('Cell')}</UI.BodyCell>;
            })}
          </UI.BodyRow>
        );
      })}
    </UI.Body>
  );
};
