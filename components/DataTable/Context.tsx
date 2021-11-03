import { useCallback } from 'react';
import { useTable, TableInstance, Column, PluginHook, TableOptions } from 'react-table';

import { createStrictContext } from 'lib/utils/context';
import { SetParamsCallback } from 'lib/hooks';

type TableFilters = { order: string; orderBy: string };

interface DataTableContextType<T extends object, F extends TableFilters> extends TableInstance<T> {
  loading?: boolean;
  filters?: F;
  setFilters?: SetParamsCallback<F>;
}

const [DataTableProvider, _useDataTable] = createStrictContext<DataTableContextType<any, any>>('DataTableContext');

export function useDataTable<T extends object, F extends TableFilters = TableFilters>(): DataTableContextType<T, F> {
  return _useDataTable();
}

type DataTableProps<T extends object, F extends TableFilters> = {
  data: T[];
  columns: Column<T>[];
  hooks?: PluginHook<T>[];
  loading?: boolean;
  filters?: F;
  setFilters?: SetParamsCallback<F>;
  children?: React.ReactNode;
} & TableOptions<T>;

export function Provider<T extends object, F extends TableFilters>({
  data,
  columns,
  hooks = [],
  renderExpandedRow,
  expandedRowOptions,
  loading,
  filters,
  setFilters,
  children,
  ...props
}: DataTableProps<T, F>) {
  const getRowId = useCallback((original: T, index: number) => {
    if (hasIdProp(original)) return original.id;
    return index.toString();
  }, []);

  const table = useTable<T>(
    {
      data,
      columns,
      expandSubRows: false,
      autoResetExpanded: false,
      renderExpandedRow,
      expandedRowOptions,
      getRowId,
      ...props,
    },
    ...hooks,
  );

  return (
    <DataTableProvider value={{ ...table, loading, filters, setFilters } as DataTableContextType<T, F>}>
      {children}
    </DataTableProvider>
  );
}

function hasIdProp(obj: any): obj is { id: string } {
  return typeof obj === 'object' && obj != null && 'id' in obj && typeof obj.id === 'string';
}
