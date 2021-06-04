import { forwardRef } from 'react';

export const VisuallyHidden = forwardRef<HTMLSpanElement, { children: React.ReactNode }>(({ children }, ref) => {
  return (
    <span
      ref={ref}
      style={{
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: '1px',
        margin: '-1px',
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        width: '1px',

        // https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
      }}
    >
      {children}
    </span>
  );
});

VisuallyHidden.displayName = 'VisuallyHidden';
