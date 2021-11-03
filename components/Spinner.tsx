import { IconLoader, TablerIcon, TablerIconProps } from '@tabler/icons';

export type SpinnerProps = { as?: TablerIcon; reverse?: boolean } & TablerIconProps;

export const Spinner: React.FC<SpinnerProps> = ({ as: Icon = IconLoader, reverse, ...props }) => {
  return <Icon {...props} className="animate-spin" style={{ animationDirection: reverse ? 'reverse' : undefined }} />;
};
