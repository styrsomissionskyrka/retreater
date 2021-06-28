import { useTable, TableInstance, Column, PluginHook, RenderExpandedRow } from 'react-table';
import { useCallback, useMemo } from 'react';

import { createStrictContext } from 'lib/utils/context';

interface DataTableContextType<T extends object> extends TableInstance<T> {
  loading?: boolean;
}

const [DataTableProvider, useDataTable] = createStrictContext<DataTableContextType<any>>('DataTableContext');

interface DataTableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
  hooks?: PluginHook<T>[];
  renderExpandedRow?: RenderExpandedRow<T>;
  loading?: boolean;
  children?: React.ReactNode;
}

export function Provider<T extends object>({
  data,
  columns,
  hooks = [],
  renderExpandedRow,
  loading,
  children,
}: DataTableProps<T>) {
  const getRowId = useCallback((original: T, index: number) => {
    if (hasIdProp(original)) return original.id;
    return index.toString();
  }, []);

  const table = useTable<T>(
    { data, columns, expandSubRows: false, autoResetExpanded: false, renderExpandedRow, getRowId },
    ...hooks,
  );

  const ctx = useMemo<DataTableContextType<T>>(
    () => ({
      ...table,
      loading,
    }),
    [loading, table],
  );

  return <DataTableProvider value={ctx}>{children}</DataTableProvider>;
}

export { useDataTable };

function hasIdProp(obj: any): obj is { id: string } {
  return typeof obj === 'object' && obj != null && 'id' in obj && typeof obj.id === 'string';
}
