import classNames from 'classnames';
import { forwardRef } from 'react';
import { ElementProps } from 'lib/utils/types';

export const Table = forwardRef<HTMLTableElement, ElementProps<'table'>>(({ children, ...props }, ref) => {
  return (
    <table {...props} ref={ref} className="w-full border-collapse table-auto leading-none">
      {children}
    </table>
  );
});

Table.displayName = 'Table.Table';

export const Head = forwardRef<HTMLTableSectionElement, ElementProps<'thead'>>(({ children, ...props }, ref) => {
  return (
    <thead {...props} ref={ref}>
      {children}
    </thead>
  );
});

Head.displayName = 'Table.Head';

export const HeadRow = forwardRef<HTMLTableRowElement, ElementProps<'tr'>>(({ children, ...props }, ref) => {
  return (
    <tr {...props} ref={ref} className="border-b">
      {children}
    </tr>
  );
});

HeadRow.displayName = 'Table.HeadRow';

export const HeadCell = forwardRef<HTMLTableHeaderCellElement, ElementProps<'th'>>(({ children, ...props }, ref) => {
  return (
    <th {...props} ref={ref} className="text-left font-medium px-2 pb-3">
      {children}
    </th>
  );
});

HeadCell.displayName = 'Table.HeadCell';

export const Body = forwardRef<HTMLTableSectionElement, ElementProps<'tbody'>>(({ children, ...props }, ref) => {
  return (
    <tbody {...props} ref={ref} className="divide-y text-sm">
      {children}
    </tbody>
  );
});

Body.displayName = 'Table.Body';

export const BodyRow = forwardRef<HTMLTableRowElement, ElementProps<'tr'>>(({ children, ...props }, ref) => {
  return (
    <tr {...props} ref={ref} className={classNames(' hover:bg-gray-100', props.className)}>
      {children}
    </tr>
  );
});

BodyRow.displayName = 'Table.BodyRow';

export const BodyCell = forwardRef<HTMLTableDataCellElement, ElementProps<'td'>>(({ children, ...props }, ref) => {
  return (
    <td {...props} ref={ref} className="p-2 h-16 font-normal text-left">
      {children}
    </td>
  );
});

BodyCell.displayName = 'Table.BodyCell';
