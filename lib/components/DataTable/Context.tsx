import { createContext, useContext } from 'react';
import { useTable, TableInstance, Column } from 'react-table';
import { ensure } from 'lib/utils/assert';

const DataTableContext = createContext<TableInstance<any> | null>(null);

interface DataTableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
  children?: React.ReactNode;
}

export function Provider<T extends object>({ data, columns, children }: DataTableProps<T>) {
  const table = useTable<T>({ data, columns });
  return <DataTableContext.Provider value={table}>{children}</DataTableContext.Provider>;
}

export function useDataTable<T extends object>() {
  return ensure(useContext(DataTableContext)) as TableInstance<T>;
}
