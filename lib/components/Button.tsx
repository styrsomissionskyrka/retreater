import classNames from 'classnames';
import { forwardRef } from 'react';

type ButtonVariant = 'default' | 'outline' | 'danger';
type ButtonSize = 'small' | 'normal' | 'large';

type ButtonProps = Omit<JSX.IntrinsicElements['button'], 'key' | 'ref'> & {
  icon?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ icon, className, type = 'button', variant = 'default', size = 'normal', children, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={classNames(
          'flex items-center space-x-2',
          'leading-none rounded',
          'disabled:cursor-not-allowed',

          variant === 'default' && 'bg-black text-white',
          variant === 'default' && 'hover:bg-gray-500',
          variant === 'default' && 'disabled:bg-gray-500',

          variant === 'outline' && 'bg-white text-black border-2 border-black',
          variant === 'outline' && 'hover:bg-gray-200',
          variant === 'outline' && 'disabled:border-gray-400 disabled:text-gray-400 disabled:bg-gray-200',

          variant === 'danger' && 'bg-red-500 text-white',
          variant === 'danger' && 'hover:bg-red-700',
          variant === 'danger' && 'disabled:bg-red-300',

          size === 'small' && 'h-8 px-2',
          size === 'normal' && 'h-10 px-5',
          size === 'large' && 'h-12 px-6',

          className,
        )}
      >
        {icon}
        {children ? <span>{children}</span> : null}
      </button>
    );
  },
);

Button.displayName = 'Button';
