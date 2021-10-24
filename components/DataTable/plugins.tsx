import { IconChevronDown, IconChevronRight } from '@tabler/icons';
import { CellProps, ColumnInstance, Column, Hooks, useExpanded as _useExpanded } from 'react-table';

import { styled } from 'styles/stitches.config';

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
          <ToggleButton
            key={key}
            type="button"
            aria-label="Visa mer"
            aria-pressed={isExpanded ? 'true' : 'false'}
            {...rest}
          >
            {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
          </ToggleButton>
        );
      },
    },
    ...columns,
  ];
}

const ToggleButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '$black',
  width: '100%',
  height: '100%',
  '&:focus': {
    outlineColor: '$black',
  },
});
