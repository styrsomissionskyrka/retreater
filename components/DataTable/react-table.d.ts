import { UseExpandedOptions, UseExpandedInstanceProps, UseExpandedState, UseExpandedRowProps } from 'react-table';

declare module 'react-table' {
  export type RenderExpandedRow<T extends object> = (row: Row<T>) => JSX.Element;

  export type ExpandedRowOptions = {
    span?: number;
  };

  export interface TableOptions<D extends object> extends UseExpandedOptions<D> {
    renderExpandedRow?: RenderExpandedRow<D>;
    expandedRowOptions?: ExpandedRowOptions;
  }
  export interface TableInstance<D extends object> extends UseExpandedInstanceProps<D> {
    renderExpandedRow?: RenderExpandedRow<D>;
    expandedRowOptions?: ExpandedRowOptions;
  }

  export interface TableState<D extends object = {}> extends UseExpandedState<D> {}

  // export interface Column<D extends object = {}> {}
  // export interface ColumnInstance<D extends object = {}> {}
  // export interface Cell<D extends object = {}> {}

  export interface ColumnInterface<D extends object = {}> extends UseTableColumnOptions<D> {
    style?: React.CSSProperties;
  }

  export interface Row<D extends object = {}> extends UseExpandedRowProps<D> {}
}
