import { useCallback } from 'react';
import { useTable, TableInstance, Column, PluginHook, TableOptions } from 'react-table';

import { createStrictContext } from 'lib/utils/context';

interface DataTableContextType<T extends object> extends TableInstance<T> {
  loading?: boolean;
}

const [DataTableProvider, useDataTable] = createStrictContext<DataTableContextType<any>>('DataTableContext');

type DataTableProps<T extends object> = {
  data: T[];
  columns: Column<T>[];
  hooks?: PluginHook<T>[];
  loading?: boolean;
  children?: React.ReactNode;
} & Pick<TableOptions<T>, 'renderExpandedRow' | 'expandedRowOptions'>;

export function Provider<T extends object>({
  data,
  columns,
  hooks = [],
  renderExpandedRow,
  expandedRowOptions,
  loading,
  children,
}: DataTableProps<T>) {
  const getRowId = useCallback((original: T, index: number) => {
    if (hasIdProp(original)) return original.id;
    return index.toString();
  }, []);

  const table = useTable<T>(
    { data, columns, expandSubRows: false, autoResetExpanded: false, renderExpandedRow, expandedRowOptions, getRowId },
    ...hooks,
  );

  return <DataTableProvider value={{ ...table, loading } as DataTableContextType<T>}>{children}</DataTableProvider>;
}

export { useDataTable };

function hasIdProp(obj: any): obj is { id: string } {
  return typeof obj === 'object' && obj != null && 'id' in obj && typeof obj.id === 'string';
}
