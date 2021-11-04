import classNames from 'classnames';

import { capitalize } from 'lib/utils/string';
import { ElementProps } from 'lib/utils/types';

function createTableComponent<Type extends keyof JSX.IntrinsicElements, Props extends {} = {}>(
  Element: Type,
  className: string | ((props: ElementProps<Type> & Props) => string),
): React.FC<ElementProps<Type> & Props> {
  const Component: React.FC<any> = (props) => {
    let cname = typeof className === 'function' ? className(props) : className;
    return <Element {...props} className={classNames(props.className, cname)} />;
  };

  Component.displayName = `Table.${capitalize(Element)}`;
  return Component;
}

export const Table = createTableComponent('table', 'w-full border-collapse table-auto leading-none');
export const Head = createTableComponent('thead', '');
export const HeadRow = createTableComponent('tr', 'border-b border-black');
export const HeadCell = createTableComponent('th', 'text-left font-medium px-2 pb-3');
export const Body = createTableComponent('tbody', 'divide-y text-sm');

export const BodyRow = createTableComponent<'tr', { expanded?: 'child' | 'parent' }>('tr', ({ expanded }) =>
  classNames('hover:bg-gray-100', {
    'bg-gray-100': expanded === 'parent',
    '!border-t-0 bg-gray-100': expanded === 'child',
  }),
);

export const BodyCell = createTableComponent<'td', { full?: boolean }>('td', ({ full }) =>
  classNames('p-2 h-16 font-normal text-left', full ? 'w-full text-center' : 'max-w-[10rem]'),
);
