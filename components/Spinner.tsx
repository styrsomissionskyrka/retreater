import { IconLoader, TablerIcon, TablerIconProps } from '@tabler/icons';
import classNames from 'classnames';

type SpinnerProps = TablerIconProps & {
  icon?: TablerIcon;
};

export const Spinner: React.FC<SpinnerProps> = ({ icon: Icon = IconLoader, className, ...props }) => {
  return <Icon {...props} className={classNames(className, 'animate-spin')} />;
};
