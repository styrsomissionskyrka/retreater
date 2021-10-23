import { useState } from 'react';

import { styled } from 'styles/stitches.config';

export interface ProgressProps {
  progress: number;
  total: number;
}

export const Progress: React.FC<ProgressProps> = ({ progress, total }) => {
  let [isHovering, setIsHovering] = useState(false);

  return (
    <Wrapper onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      {!isHovering ? (
        <BarWrapper>
          <BarBorder>
            <Bar style={{ width: `calc(100% * (${progress + 3} / ${total}))` }} />
          </BarBorder>
        </BarWrapper>
      ) : (
        <Display>
          {progress} / {total}
        </Display>
      )}
    </Wrapper>
  );
};

const Wrapper = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
});

const BarWrapper = styled('div', {
  position: 'absolute',
  width: '100%',
  height: '100%',
  inset: '$0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const BarBorder = styled('div', {
  position: 'relative',
  width: '100%',
  height: '$2',
  borderRadius: '$md',
  border: '1px solid $black',
  overflow: 'hidden',
});

const Bar = styled('div', {
  height: '100%',
  backgroundColor: '$black',
  borderRadius: '$md',
});

const Display = styled('div', {
  position: 'absolute',
  inset: '$0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontVariantNumeric: 'tabular-nums',
});
