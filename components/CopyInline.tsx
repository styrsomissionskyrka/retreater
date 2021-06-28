import { useState } from 'react';
import { IconCopy } from '@tabler/icons';

import { toast } from './Toast';

type CopyProps = { children: string } | { value: string; children: React.ReactNode };

export const CopyInline = (props: CopyProps) => {
  const [showIcon, setShowIcon] = useState(false);
  const { children } = props;

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
      className="cursor-pointer inline-flex space-x-1 items-center"
      onClick={handleClick}
      onMouseEnter={() => setShowIcon(true)}
      onMouseLeave={() => setShowIcon(false)}
      onFocus={() => setShowIcon(true)}
      onBlur={() => setShowIcon(false)}
    >
      <span>{children}</span>
      <IconCopy size="1em" className={showIcon ? 'opacity-100 visible' : 'opacity-0 invisible'} />
    </button>
  );
};
