import classNames from 'classnames';
import { forwardRef, useRef } from 'react';

import { useControlledInput, useIsomorphicLayoutEffect, useSafeState } from 'lib/hooks';
import { composeEventHandlers } from 'lib/utils/events';
import { ElementProps } from 'lib/utils/types';

import { Spinner } from './Spinner';
import { VisuallyHidden } from './VisuallyHidden';

type ButtonVariant = 'default' | 'outline' | 'danger';
type ButtonSizeBase = 'small' | 'normal' | 'large';
type ButtonSize = ButtonSizeBase | `square-${ButtonSizeBase}`;

export type ButtonProps = Omit<ElementProps<'button'>, 'size'> & {
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { iconStart, iconEnd, className, type = 'button', variant = 'default', size = 'normal', children, ...props },
    ref,
  ) => {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={classNames(
          'flex items-center justify-center space-x-2',
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
          size === 'square-small' && 'h-8 w-8',
          size === 'square-normal' && 'h-10 w-10',
          size === 'square-large' && 'h-12 w-12',

          className,
        )}
      >
        {iconStart}
        {children ? <span>{children}</span> : null}
        {iconEnd}
      </button>
    );
  },
);

Button.displayName = 'Button';

export const LoadingButton: React.FC<Omit<ButtonProps, 'onClick'> & { onClick: () => Promise<any> }> = ({
  iconStart,
  onClick,
  disabled,
  children,
  ...props
}) => {
  const [loading, setLoading] = useSafeState(false);

  let handleClick: React.MouseEventHandler<HTMLButtonElement> = async () => {
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  let icon = loading ? <Spinner size={16} /> : iconStart;

  return (
    <Button {...props} iconStart={icon} onClick={handleClick} disabled={loading || disabled}>
      {children}
    </Button>
  );
};

type ToggleButtonProps = Omit<ElementProps<'input'>, 'type' | 'value' | 'defaultValue' | 'size'> & {
  pending?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSizeBase;
};

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  checked: providedChecked,
  defaultChecked = false,
  pending,
  disabled,
  size = 'small',
  onChange = () => {},
  children,
  ...props
}) => {
  const [checked, setControlledChecked] = useControlledInput(providedChecked, defaultChecked);
  const ref = useRef<HTMLInputElement>(null);

  let state: 'checked' | 'unchecked' | 'pending' = checked ? 'checked' : 'unchecked';
  if (pending) state = 'pending';

  useIsomorphicLayoutEffect(() => {
    if (ref.current != null) {
      ref.current.indeterminate = !!pending;
    }
  }, [pending]);

  let wrapperClassName = classNames(
    'border-2 border-black flex items-center',
    size === 'small' && 'h-6 w-10 p-1 rounded-xl',
    size === 'normal' && 'h-8 w-14 p-1 rounded-2xl',
    size === 'large' && 'h-10 w-16 p-1 rounded-[20px]',

    state === 'checked' && 'justify-start bg-green-500',
    state === 'unchecked' && 'justify-end bg-white',
    state === 'pending' && 'justify-center bg-gray-300',

    disabled && '!bg-white border-gray-500',

    'transition transition-background',
  );

  let toggleClassName = classNames(
    'bg-black rounded-full text-white flex justify-center items-center',
    size === 'small' && 'h-4 w-4',
    size === 'normal' && 'h-6 w-6',
    size === 'large' && 'h-8 w-8',

    state === 'checked' && 'bg-black',
    state === 'unchecked' && 'bg-black',
    state === 'pending' && 'bg-black',

    disabled && 'bg-gray-400',
  );

  let spinnerSize = size === 'small' ? 10 : size === 'normal' ? 16 : 18;

  return (
    <label className="flex items-center space-x-2 focus-within:outline-black">
      <VisuallyHidden>
        <input
          {...props}
          ref={ref}
          type="checkbox"
          checked={checked}
          disabled={state === 'pending' || disabled}
          onChange={composeEventHandlers(onChange, (e) => setControlledChecked(e.target.checked))}
        />
      </VisuallyHidden>
      <div className={wrapperClassName}>
        <div className={toggleClassName}>{state === 'pending' ? <Spinner size={spinnerSize} /> : null}</div>
      </div>
      {children ? <span>{children}</span> : null}
    </label>
  );
};
