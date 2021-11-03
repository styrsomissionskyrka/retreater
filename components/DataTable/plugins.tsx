import { IconChevronDown, IconChevronRight } from '@tabler/icons';
import { CellProps, ColumnInstance, Column, Hooks, useExpanded as _useExpanded } from 'react-table';

export function useExpanded<T extends object>(hooks: Hooks<T>) {
  _useExpanded(hooks);
  hooks.visibleColumns.push(visibleColumns);
}

useExpanded.pluginName = 'useExpanded';

function visibleColumns<T extends object>(columns: ColumnInstance<T>[]): Column<T>[] {
  return [
    {
      id: '__expanded__',
      Header: () => null,
      Cell({ row }: CellProps<T, unknown>) {
        let { isExpanded } = row;
        let { key, ...rest } = row.getToggleRowExpandedProps();

        return (
          <button
            key={key}
            type="button"
            aria-label="Visa mer"
            aria-pressed={isExpanded ? 'true' : 'false'}
            className="flex items-center justify-center cursor-pointer text-black w-full h-full focus:outline-black"
            {...rest}
          >
            {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
          </button>
        );
      },
    },
    ...columns,
  ];
}
