import { ElementProps } from 'lib/utils/types';

export const Time: React.FC<ElementProps<'time'>> = ({ children, ...props }) => (
  <time {...props} className="tabular-nums">
    {children}
  </time>
);
