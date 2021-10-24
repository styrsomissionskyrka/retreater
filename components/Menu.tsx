import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FocusLock from 'react-focus-lock';
import { IconChevronDown, IconDots } from '@tabler/icons';

import { composeEventHandlers } from 'lib/utils/events';
import { useId } from 'lib/hooks';
import { createStrictContext } from 'lib/utils/context';
import { styled } from 'styles/stitches.config';

import { Portal } from './Portal';
import { Popover } from './Popover';
import { Button as UIButton, ButtonProps } from './Button';
import { Spinner } from './Spinner';

interface MenuContextType {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  buttonRef: React.RefObject<HTMLButtonElement>;
  menuId: string;
  buttonId: string;
}

const [MenuContextProvider, useMenuContext] = createStrictContext<MenuContextType>('MenuContext');

export type MenuButtonProps = Pick<
  JSX.IntrinsicElements['button'],
  'ref' | 'id' | 'onClick' | 'aria-expanded' | 'aria-haspopup' | 'aria-controls'
>;

export function useMenuButton() {
  const { setIsExpanded, buttonRef, buttonId, isExpanded, menuId } = useMenuContext();

  const onClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    () => setIsExpanded((previous) => !previous),
    [setIsExpanded],
  );

  return {
    ref: buttonRef,
    id: buttonId,
    onClick,
    'aria-expanded': isExpanded ? true : undefined,
    'aria-haspopup': true,
    'aria-controls': menuId,
  };
}

export const Wrapper: React.FC = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const id = useId('');

  const context = useMemo<MenuContextType>(
    () => ({
      isExpanded,
      setIsExpanded,
      buttonRef,
      menuId: `menu-${id}`,
      buttonId: `menu-button-${id}`,
    }),
    [isExpanded, id],
  );

  return <MenuContextProvider value={context}>{children}</MenuContextProvider>;
};

export const ContextButton: React.FC<{ label?: string }> = ({ label = 'Meny' }) => {
  const props = useMenuButton();
  return (
    <UIButton {...props} square size="small" variant="outline" iconStart={<IconDots size={16} />} aria-label={label} />
  );
};

export const Button: React.FC<Omit<ButtonProps, keyof MenuButtonProps> & { loading?: boolean }> = ({
  loading,
  children,
  ...props
}) => {
  const menuButtonProps = useMenuButton();
  return (
    <UIButton {...props} {...menuButtonProps} iconEnd={loading ? <Spinner size={16} /> : <IconChevronDown size={16} />}>
      {children}
    </UIButton>
  );
};

const ActionWrapper = styled('div', {
  display: 'flex',
  flexFlow: 'column nowrap',
  border: '2px solid $black',
  divideY: '$2',
  background: '$white',
});

export const Actions: React.FC = ({ children }) => {
  const { buttonRef, menuId, buttonId, isExpanded, setIsExpanded } = useMenuContext();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded) {
      const listener = (event: MouseEvent | TouchEvent) => {
        const isPopoverClick = targetIsWithinRef(event.target, popoverRef);
        const isMenuButtonClick = targetIsWithinRef(event.target, buttonRef);
        if (!isPopoverClick && !isMenuButtonClick) setIsExpanded(false);
      };

      window.addEventListener('mousedown', listener);
      return () => window.removeEventListener('mousedown', listener);
    }
  }, [buttonRef, isExpanded, setIsExpanded]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      setIsExpanded(false);
    }
  };

  return (
    <Portal>
      <Popover ref={popoverRef} targetRef={buttonRef} hidden={!isExpanded}>
        <FocusLock autoFocus={false} returnFocus disabled={!isExpanded}>
          <ActionWrapper
            id={menuId}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={handleKeyDown}
            role="menu"
            tabIndex={-1}
            aria-labelledby={buttonId}
          >
            {children}
          </ActionWrapper>
        </FocusLock>
      </Popover>
    </Portal>
  );
};

export type ActionProps = { onClick: React.MouseEventHandler<HTMLButtonElement>; disabled?: boolean };

const ActionImpl = styled('button', {
  px: '$4',
  py: '$2',
  textAlign: 'left',
  '&:hover': { background: '$gray300' },
  '&:focus': { outline: '$black' },
  '&:disabled': {
    color: '$gray500',
    cursor: 'not-allowed',
  },
  '&:disabled:hover': { background: '$white' },
});

export const Action: React.FC<ActionProps> = ({ onClick, disabled, children }) => {
  const { setIsExpanded } = useMenuContext();
  const closeMenu = () => setIsExpanded(false);

  return (
    <ActionImpl role="menuitem" type="button" onClick={composeEventHandlers(onClick, closeMenu)} disabled={disabled}>
      {children}
    </ActionImpl>
  );
};

function targetIsWithinRef(target: EventTarget | null, ref: React.RefObject<HTMLElement>): boolean {
  if (!(target instanceof Node)) return false;
  if (ref.current == null) return false;
  return target === ref.current || ref.current.contains(target);
}
