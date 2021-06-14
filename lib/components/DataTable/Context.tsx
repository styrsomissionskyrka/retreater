import { useTable, TableInstance, Column } from 'react-table';

import { createStrictContext } from 'lib/utils/context';

const [DataTableProvider, useDataTable] = createStrictContext<TableInstance<any>>('DataTableContext');

interface DataTableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
  children?: React.ReactNode;
}

export function Provider<T extends object>({ data, columns, children }: DataTableProps<T>) {
  const table = useTable<T>({ data, columns });
  return <DataTableProvider value={table}>{children}</DataTableProvider>;
}

export { useDataTable };
