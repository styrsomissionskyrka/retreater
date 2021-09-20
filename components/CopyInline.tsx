import { IconCopy } from '@tabler/icons';

import { styled } from 'styles/stitches.config';

import { toast } from './Toast';

type CopyProps = { children: string } | { value: string; children: React.ReactNode };

export const CopyInline = (props: CopyProps) => {
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
    <InlineButton onClick={handleClick}>
      <span>{children}</span>
      <IconCopy size="1em" />
    </InlineButton>
  );
};

const InlineButton = styled('button', {
  display: 'inline-flex',
  alignItems: 'center',
  spaceX: '$1',
  cursor: 'pointer',

  '& svg': { opacity: 0, visibility: 'hidden' },
  '&:hover svg, &:focus svg': { opacity: 1, visibility: 'visible' },
});
