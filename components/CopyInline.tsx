import { IconCopy } from '@tabler/icons';
import classNames from 'classnames';

import { useHover } from 'lib/hooks';

import { toast } from './Toast';

type CopyProps = { children: string } | { value: string; children: React.ReactNode };

export const CopyInline = (props: CopyProps) => {
  const { children } = props;
  const { isHovering, ...elProps } = useHover();

  const handleClick = async () => {
    let text = 'value' in props ? props.value : props.children;
    await toast.promise(window.navigator.clipboard.writeText(text), {
      loading: '...',
      success: 'Kopierat',
      error: 'Kunde inte kopiera',
    });
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center space-x-1 cursor-pointer focus:outline-black"
      {...elProps}
    >
      <span>{children}</span>
      <IconCopy size="1em" className={classNames(isHovering ? 'opacity-100 visible' : 'opacity-0 invisible')} />
    </button>
  );
};
