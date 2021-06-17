import { UseExpandedOptions, UseExpandedInstanceProps, UseExpandedState, UseExpandedRowProps } from 'react-table';

declare module 'react-table' {
  type RenderExpandedRow<T extends object> = (row: Row<T>) => JSX.Element;

  export interface TableOptions<D extends object> extends UseExpandedOptions<D> {
    renderExpandedRow?: RenderExpandedRow<D>;
  }
  export interface TableInstance<D extends object> extends UseExpandedInstanceProps<D> {
    renderExpandedRow?: RenderExpandedRow<D>;
  }

  export interface TableState<D extends object = {}> extends UseExpandedState<D> {}

  // export interface Column<D extends object = {}> {}
  // export interface ColumnInstance<D extends object = {}> {}
  // export interface Cell<D extends object = {}> {}

  export interface Row<D extends object = {}> extends UseExpandedRowProps<D> {}
}
