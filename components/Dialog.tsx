import React, { forwardRef, useCallback, useRef } from 'react';
import FocusLock from 'react-focus-lock';
import { RemoveScroll } from 'react-remove-scroll';

import { useComposedRefs } from 'lib/hooks';
import { composeEventHandlers } from 'lib/utils/events';
import { styled } from 'styles/stitches.config';

import { Portal } from './Portal';

const noop = () => {};

export const Title = styled('h2', {
  text: '$xl',
  fontWeight: '$medium',
  marginBottom: '$8',
});

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
  zIndex: '$50',

  variants: {
    mode: {
      dialog: {
        padding: '$8',
      },
      sidebar: {},
    },
  },
  defaultVariants: {
    mode: 'dialog',
  },
});

const Overlay = forwardRef<HTMLDivElement, OverlayProps & React.ComponentProps<typeof OverlayImpl>>(
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

export const ContentImpl = styled('div', {
  width: '$full',
  background: '$white',
  padding: '$8',
  border: '1px solid $black',

  variants: {
    mode: {
      dialog: {
        mx: 'auto',
        maxWidth: '$max2xl',
        marginTop: '$20',
        [`& ${Title}`]: {
          textAlign: 'center',
        },
      },
      sidebar: {
        height: '100vh',
        maxHeight: '100vh',
        margin: '0 0 auto auto',
        maxWidth: '$maxMd',
        overflow: 'scroll',

        [`& ${Title}`]: {
          textAlign: 'left',
        },
      },
    },
  },
  defaultVariants: {
    mode: 'dialog',
  },
});

export type ContentProps = Omit<React.ComponentProps<typeof ContentImpl>, 'aria-modal' | 'role' | 'tabIndex'>;

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
  ({ isOpen, mode, initialFocusRef, onDismiss, children, ...props }, ref) => {
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
