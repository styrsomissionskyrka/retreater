import { forwardRef, useCallback, useRef } from 'react';
import FocusLock from 'react-focus-lock';
import { RemoveScroll } from 'react-remove-scroll';
import classNames from 'classnames';

import { useComposedRefs } from 'lib/hooks';
import { composeEventHandlers } from 'lib/utils/events';
import { ElementProps } from 'lib/utils/types';

import { Portal } from './Portal';

const noop = () => {};

export interface OverlayProps {
  isOpen?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  onDismiss?: (event?: React.SyntheticEvent) => void;
}

const Overlay = forwardRef<HTMLDivElement, OverlayProps & ElementProps<'div'>>(
  (
    {
      isOpen,
      initialFocusRef,
      className,
      onDismiss = noop,
      onClick = noop,
      onKeyDown = noop,
      onMouseDown = noop,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const mouseDownTarget = useRef<EventTarget | null>(null);
    const overlayNode = useRef<HTMLDivElement>(null);
    const ref = useComposedRefs(overlayNode, forwardedRef);

    const activateFocusLock = useCallback(() => {
      if (initialFocusRef && initialFocusRef.current != null) {
        initialFocusRef.current.focus();
      }
    }, [initialFocusRef]);

    const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
      if (mouseDownTarget.current === event.target) {
        event.stopPropagation();
        onDismiss(event);
      }
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onDismiss(event);
      }
    };

    const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
      mouseDownTarget.current = event.target;
    };

    return isOpen ? (
      <Portal>
        <FocusLock autoFocus returnFocus onActivation={activateFocusLock}>
          <RemoveScroll>
            <div
              {...props}
              ref={ref}
              className={classNames(className, 'fixed inset-0 overflow-auto bg-opacity-20 bg-black p-8 z-50')}
              onClick={composeEventHandlers(onClick, handleClick)}
              onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
              onMouseDown={composeEventHandlers(onMouseDown, handleMouseDown)}
            >
              {children}
            </div>
          </RemoveScroll>
        </FocusLock>
      </Portal>
    ) : null;
  },
);

Overlay.displayName = 'Dialog.Inner';

export type ContentProps = Omit<ElementProps<'div'>, 'aria-modal' | 'role' | 'tabIndex'>;

export const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ className, onClick = noop, children, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        aria-modal="true"
        role="dialog"
        tabIndex={-1}
        onClick={composeEventHandlers(onClick, (event) => event.stopPropagation())}
        className={classNames(className, 'w-full mx-auto bg-white border border-black p-8')}
      >
        {children}
      </div>
    );
  },
);

Content.displayName = 'Dialog.Content';

export const Dialog = forwardRef<HTMLDivElement, OverlayProps & ContentProps>(
  ({ isOpen, initialFocusRef, onDismiss, className, children, ...props }, ref) => {
    return (
      <Overlay isOpen={isOpen} initialFocusRef={initialFocusRef} onDismiss={onDismiss}>
        <Content {...props} ref={ref} className={classNames(className, 'max-w-2xl mt-20')}>
          {children}
        </Content>
      </Overlay>
    );
  },
);

Dialog.displayName = 'Dialog';
