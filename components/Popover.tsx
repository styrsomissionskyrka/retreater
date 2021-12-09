import { PRect, useRect } from '@reach/rect';
import { forwardRef, useRef } from 'react';
import { useComposedRefs } from '@fransvilhelm/hooks';

import { ElementProps } from 'lib/utils/types';

import { Portal } from './Portal';

export type PositionFn = (targetRect: PRect, popoverRect: PRect) => React.CSSProperties;

export interface PopoverProps extends ElementProps<'div'> {
  targetRef: React.RefObject<HTMLElement>;
  position?: PositionFn;
}

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  ({ targetRef, position = left, children, ...props }, forwardedRef) => {
    const popoverRef = useRef<HTMLDivElement>(null);
    const popoverRect = useRect(popoverRef, { observe: !props.hidden });
    const targetRect = useRect(targetRef, { observe: !props.hidden });
    const ref = useComposedRefs(popoverRef, forwardedRef);

    return (
      <Portal>
        <div
          {...props}
          ref={ref}
          style={{
            position: 'absolute',
            ...getPosition(position, targetRect, popoverRect),
            ...props.style,
          }}
        >
          {children}
        </div>
      </Portal>
    );
  },
);

Popover.displayName = 'Popover';

export function getPosition(
  positionFn: PositionFn,
  targetRect: PRect | null,
  popoverRect: PRect | null,
): React.CSSProperties {
  if (targetRect == null || popoverRect == null) return { visibility: 'hidden' };
  return positionFn(targetRect, popoverRect);
}

/**
 * Position the popover left aligned below the target element. If the popover
 * collides with the bottom of the screen it will move above the target element.
 *
 * ```
 * ┌────────┐
 * │ TARGET │
 * └────────┘
 * ┌─────────────┐
 * │ POPOVER     │
 * └─────────────┘
 * ```
 */
export const left: PositionFn = (targetRect, popoverRect) => {
  const { directionRight } = getCollisions(targetRect, popoverRect);
  return {
    left: directionRight
      ? `${targetRect.right - popoverRect.width + window.pageXOffset}px`
      : `${targetRect.left + window.pageXOffset}px`,
    ...getTopPosition(targetRect, popoverRect),
  };
};

/**
 * Position the popover right aligned below the target element. If the popover
 * collides with the bottom of the screen it will move above the target element.
 *
 * ```
 *      ┌────────┐
 *      │ TARGET │
 *      └────────┘
 * ┌─────────────┐
 * │ POPOVER     │
 * └─────────────┘
 * ```
 */
export const right: PositionFn = (targetRect, popoverRect) => {
  const { directionLeft } = getCollisions(targetRect, popoverRect);
  return {
    left: directionLeft
      ? targetRect.left + window.pageXOffset
      : targetRect.right - popoverRect.width + window.pageXOffset,
    ...getTopPosition(targetRect, popoverRect),
  };
};

/**
 * Match the full width of the target element and position below by default, but
 * if the popover collides with the screen edges below the target it will move
 * up above the target.
 *
 * ```
 * ┌──────────────────┐
 * │      TARGET      │
 * └──────────────────┘
 * ┌──────────────────┐
 * │ POPOVER          │
 * └──────────────────┘
 * ```
 */
export const matchWidth: PositionFn = (targetRect, popoverRect) => {
  return {
    width: targetRect.width,
    left: targetRect.left,
    ...getTopPosition(targetRect, popoverRect),
  };
};

/**
 * Get the top position of the popover. It uses collision detection to decide
 * which position is the best fit. It will default to end up below the target
 * element. But if the popover collides with the screen edges it will move above
 * the target element.
 */
function getTopPosition(targetRect: PRect, popoverRect: PRect) {
  const { directionUp } = getCollisions(targetRect, popoverRect);
  return {
    top: directionUp
      ? targetRect.top - popoverRect.height + window.pageYOffset - 4
      : targetRect.top + targetRect.height + window.pageYOffset + 4,
  };
}

function getCollisions(targetRect: PRect, popoverRect: PRect, offsetLeft = 0, offsetBottom = 0) {
  const collisions = {
    top: targetRect.top - popoverRect.height < 0,
    right: window.innerWidth < targetRect.left + popoverRect.width - offsetLeft,
    bottom: window.innerHeight < targetRect.bottom + popoverRect.height - offsetBottom,
    left: targetRect.left + targetRect.width - popoverRect.width < 0,
  };

  const directionRight = collisions.right && !collisions.left;
  const directionLeft = collisions.left && !collisions.right;
  const directionUp = collisions.bottom && !collisions.top;
  const directionDown = collisions.top && !collisions.bottom;

  return { directionRight, directionLeft, directionUp, directionDown };
}
