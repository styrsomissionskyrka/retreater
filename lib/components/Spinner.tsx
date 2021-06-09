import { IconLoader, TablerIconProps } from '@tabler/icons';
import classNames from 'classnames';

export const Spinner: React.FC<TablerIconProps> = ({ className, ...props }) => {
  return <IconLoader {...props} className={classNames(className, 'animate-spin')} />;
};
