import classNames from 'classnames';
import { forwardRef } from 'react';

type ButtonProps = Omit<JSX.IntrinsicElements['button'], 'key' | 'ref'> & { icon?: React.ReactNode };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ icon, className, type = 'button', children, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={classNames(
          'flex items-center space-x-2',
          'bg-gray-700 text-white px-4 py-3 leading-none rounded',
          'hover:bg-gray-500',
          className,
        )}
      >
        {icon}
        <span>{children}</span>
      </button>
    );
  },
);

Button.displayName = 'Button';
