import React, { forwardRef, useCallback, useRef } from 'react';
import FocusLock from 'react-focus-lock';
import { RemoveScroll } from 'react-remove-scroll';
import classNames from 'classnames';
import { useComposedRefs } from '@fransvilhelm/hooks';

import { composeEventHandlers } from 'lib/utils/events';
import { ElementProps } from 'lib/utils/types';

import { Portal } from './Portal';

const noop = () => {};

export const Title = forwardRef<HTMLHeadingElement, ElementProps<'h2'>>(({ className, children, ...props }, ref) => {
  return (
    <h2 {...props} ref={ref} className={classNames(className, 'text-xl font-medium mb-8')}>
      {children}
    </h2>
  );
});

Title.displayName = 'Title';

type DialogMode = 'dialog' | 'sidebar';

export interface OverlayProps {
  isOpen?: boolean;
  mode?: DialogMode;
  initialFocusRef?: React.RefObject<HTMLElement>;
  onDismiss?: (event?: React.SyntheticEvent) => void;
  children?: React.ReactNode;
}

const Overlay = forwardRef<HTMLDivElement, OverlayProps & ElementProps<'div'>>(
  (
    {
      isOpen,
      mode = 'dialog',
      initialFocusRef,
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
              onClick={composeEventHandlers(onClick, handleClick)}
              onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
              onMouseDown={composeEventHandlers(onMouseDown, handleMouseDown)}
              className={classNames('fixed inset-0 overflow-auto bg-black bg-opacity-20 z-50', {
                'p-8': mode === 'dialog',
              })}
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

export type ContentProps = {
  mode?: DialogMode;
  children?: React.ReactNode;
};

export const Content = forwardRef<HTMLDivElement, ContentProps & ElementProps<'div'>>(
  ({ mode = 'dialog', onClick = noop, children, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        aria-modal="true"
        role="dialog"
        tabIndex={-1}
        onClick={composeEventHandlers(onClick, (event) => event.stopPropagation())}
        className={classNames('w-full bg-white p-8 border border-black', {
          'mx-auto max-w-2xl mt-20': mode === 'dialog',
          'absolute inset-y-0 right-0 max-w-md overflow-scroll': mode === 'sidebar',
        })}
      >
        {children}
      </div>
    );
  },
);

Content.displayName = 'Dialog.Content';

export const Dialog = forwardRef<HTMLDivElement, OverlayProps & ContentProps>(
  ({ isOpen, mode = 'dialog', initialFocusRef, onDismiss, children, ...props }, ref) => {
    return (
      <Overlay isOpen={isOpen} mode={mode} initialFocusRef={initialFocusRef} onDismiss={onDismiss}>
        <Content {...props} mode={mode} ref={ref}>
          {children}
        </Content>
      </Overlay>
    );
  },
);

Dialog.displayName = 'Dialog';
