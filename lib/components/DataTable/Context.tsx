import { useTable, TableInstance, Column, PluginHook, RenderExpandedRow } from 'react-table';

import { createStrictContext } from 'lib/utils/context';

const [DataTableProvider, useDataTable] = createStrictContext<TableInstance<any>>('DataTableContext');

interface DataTableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
  hooks?: PluginHook<T>[];
  renderExpandedRow?: RenderExpandedRow<T>;
  children?: React.ReactNode;
}

export function Provider<T extends object>({
  data,
  columns,
  hooks = [],
  renderExpandedRow,
  children,
}: DataTableProps<T>) {
  const table = useTable<T>(
    { data, columns, expandSubRows: false, autoResetExpanded: false, renderExpandedRow },
    ...hooks,
  );
  return <DataTableProvider value={{ ...table } as TableInstance<T>}>{children}</DataTableProvider>;
}

export { useDataTable };
