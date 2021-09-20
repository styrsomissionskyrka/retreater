import { forwardRef, useCallback, useRef } from 'react';
import FocusLock from 'react-focus-lock';
import { RemoveScroll } from 'react-remove-scroll';

import { useComposedRefs } from 'lib/hooks';
import { composeEventHandlers } from 'lib/utils/events';
import { ElementProps } from 'lib/utils/types';
import { styled } from 'styles/stitches.config';

import { Portal } from './Portal';

const noop = () => {};

export interface OverlayProps {
  isOpen?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  onDismiss?: (event?: React.SyntheticEvent) => void;
}

const OverlayImpl = styled('div', {
  position: 'fixed',
  inset: '$0',
  overflow: 'auto',
  backgroundColor: 'hsl(220deg 9% 5% / 20%)', // $black with 20% opacity
  padding: '$8',
  zIndex: '$50',
});

const Overlay = forwardRef<HTMLDivElement, OverlayProps & ElementProps<'div'>>(
  (
    {
      isOpen,
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
            <OverlayImpl
              {...props}
              ref={ref}
              onClick={composeEventHandlers(onClick, handleClick)}
              onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
              onMouseDown={composeEventHandlers(onMouseDown, handleMouseDown)}
            >
              {children}
            </OverlayImpl>
          </RemoveScroll>
        </FocusLock>
      </Portal>
    ) : null;
  },
);

Overlay.displayName = 'Dialog.Inner';

export type ContentProps = Omit<ElementProps<'div'>, 'aria-modal' | 'role' | 'tabIndex'>;

export const ContentImpl = styled('div', {
  width: '$full',
  mx: 'auto',
  padding: '$8',
  background: '$white',
  border: '1px solid $black',
  maxWidth: '$max2xl',
  marginTop: '$20',
});

export const Content = forwardRef<HTMLDivElement, ContentProps>(({ onClick = noop, children, ...props }, ref) => {
  return (
    <ContentImpl
      {...props}
      ref={ref}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      onClick={composeEventHandlers(onClick, (event) => event.stopPropagation())}
    >
      {children}
    </ContentImpl>
  );
});

Content.displayName = 'Dialog.Content';

export const Dialog = forwardRef<HTMLDivElement, OverlayProps & ContentProps>(
  ({ isOpen, initialFocusRef, onDismiss, className, children, ...props }, ref) => {
    return (
      <Overlay isOpen={isOpen} initialFocusRef={initialFocusRef} onDismiss={onDismiss}>
        <Content {...props} ref={ref}>
          {children}
        </Content>
      </Overlay>
    );
  },
);

Dialog.displayName = 'Dialog';
