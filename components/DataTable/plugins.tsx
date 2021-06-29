import { IconChevronDown, IconChevronRight } from '@tabler/icons';
import classNames from 'classnames';
import {
  CellProps,
  ColumnInstance,
  Column,
  Hooks,
  useExpanded as _useExpanded,
  TableExpandedToggleProps,
  HeaderProps,
} from 'react-table';

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
        return (
          <ExpandedToggle
            isExpanded={row.isExpanded}
            {...row.getToggleRowExpandedProps()}
            aria-label="Visa mer"
            aria-pressed={row.isExpanded ? 'true' : 'false'}
            className={classNames('flex items-center', 'cursor-pointer text-black')}
          />
        );
      },
    },
    ...columns,
  ];
}

const ExpandedToggle: React.FC<{ isExpanded: boolean } & TableExpandedToggleProps> = ({ isExpanded, ...props }) => {
  return (
    <button
      {...props}
      type="button"
      aria-label="Visa mer"
      aria-pressed={isExpanded ? 'true' : 'false'}
      className={classNames(
        'flex items-center justify-center',
        'cursor-pointer text-black',
        'w-full h-full',
        'focus:outline-black',
      )}
    >
      {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
    </button>
  );
};
