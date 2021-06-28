import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FocusLock from 'react-focus-lock';
import { IconChevronDown, IconDots } from '@tabler/icons';

import { composeEventHandlers } from 'lib/utils/events';
import { useId } from 'lib/hooks';
import { createStrictContext } from 'lib/utils/context';

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
    <UIButton {...props} size="square-small" variant="outline" iconStart={<IconDots size={16} />} aria-label={label} />
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
          <div
            id={menuId}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={handleKeyDown}
            role="menu"
            tabIndex={-1}
            aria-labelledby={buttonId}
            className="flex flex-col border-2 border-black divide-y-2 divide-black bg-white"
          >
            {children}
          </div>
        </FocusLock>
      </Popover>
    </Portal>
  );
};

export type ActionKind = 'normal' | 'destructive';
export type ActionProps = { kind?: ActionKind; onClick: React.MouseEventHandler<HTMLButtonElement> };

export const Action: React.FC<ActionProps> = ({ onClick, children }) => {
  const { setIsExpanded } = useMenuContext();
  const closeMenu = () => setIsExpanded(false);

  return (
    <button
      role="menuitem"
      type="button"
      onClick={composeEventHandlers(onClick, closeMenu)}
      className="text-left px-4 py-2 hover:bg-gray-300"
    >
      {children}
    </button>
  );
};

function targetIsWithinRef(target: EventTarget | null, ref: React.RefObject<HTMLElement>): boolean {
  if (!(target instanceof Node)) return false;
  if (ref.current == null) return false;
  return target === ref.current || ref.current.contains(target);
}
