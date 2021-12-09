import { forwardRef, useRef } from 'react';
import classNames from 'classnames';
import { useControlledState, useIsomorphicLayoutEffect } from '@fransvilhelm/hooks';

import { useSafeState } from 'lib/hooks';
import { composeEventHandlers } from 'lib/utils/events';
import { ElementProps } from 'lib/utils/types';

import { Spinner } from './Spinner';
import { VisuallyHidden } from './VisuallyHidden';
import { toast } from './Toast';

export type ButtonSize = 'small' | 'normal' | 'large';
export type ButtonVariant = 'default' | 'outline' | 'danger';

export type ButtonProps = ElementProps<'button'> & {
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  square?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'button',
      variant = 'default',
      size = 'normal',
      iconStart,
      iconEnd,
      square,
      className: passedClassName,
      children,
      ...props
    },
    ref,
  ) => {
    let className = classNames(
      'flex items-center justify-center space-x-2 leading-none rounded-md',
      'disabled:cursor-not-allowed focus:outline-black',

      // variant
      {
        'bg-black text-white hover:bg-gray-500 disabled:bg-gray-500': variant === 'default',
        'hover:bg-gray-500': variant === 'default',
        'disabled:bg-gray-500': variant === 'default',

        'bg-white text-black border-2 border-black': variant === 'outline',
        'hover:bg-gray-400': variant === 'outline',
        'disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200': variant === 'outline',

        'bg-red-500 text-white': variant === 'danger',
        'hover:bg-red-700': variant === 'danger',
        'disabled:bg-red-300': variant === 'danger',
      },

      // size
      {
        'h-8 text-sm': size === 'small',
        'h-10': size === 'normal',
        'h-12': size === 'large',
        'px-3': size === 'small' && !square,
        'px-5': size === 'normal' && !square,
        'px-6': size === 'large' && !square,
      },

      // square
      {
        'flex-none p-0': square,
        'w-8': square && size === 'small',
        'w-10': square && size === 'normal',
        'w-12': square && size === 'large',
      },
    );

    return (
      <button {...props} className={className} ref={ref} type={type}>
        {iconStart}
        {children ? <span>{children}</span> : null}
        {iconEnd}
      </button>
    );
  },
);

Button.displayName = 'Button';

type LoadingMessages = {
  loading?: string;
  success: string;
  error: string;
};

type LoadingButtonProps = Omit<ButtonProps, 'onClick'> & {
  onClick: () => Promise<any>;
  spinner?: React.ReactNode;
  messages?: LoadingMessages;
};

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  iconStart,
  onClick,
  disabled,
  children,
  spinner = <Spinner size={16} />,
  messages,
  ...props
}) => {
  const [loading, setLoading] = useSafeState(false);

  let handleClick: React.MouseEventHandler<HTMLButtonElement> = async () => {
    setLoading(true);
    try {
      if (messages) {
        await toast.promise(onClick(), { loading: 'Laddar...', ...messages });
      } else {
        await onClick();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  let icon = loading ? spinner : iconStart;

  return (
    <Button {...props} iconStart={icon} onClick={handleClick} disabled={loading || disabled}>
      {children}
    </Button>
  );
};

type ToggleButtonProps = Omit<ElementProps<'input'>, 'type' | 'value' | 'defaultValue' | 'size'> & {
  pending?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
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
  const [checked, setControlledChecked] = useControlledState(providedChecked, defaultChecked);
  const ref = useRef<HTMLInputElement>(null);

  let state: 'checked' | 'unchecked' | 'pending' = checked ? 'checked' : 'unchecked';
  if (pending) state = 'pending';

  useIsomorphicLayoutEffect(() => {
    if (ref.current != null) {
      ref.current.indeterminate = !!pending;
    }
  }, [pending]);

  let spinnerSize = size === 'small' ? 10 : size === 'normal' ? 16 : 18;

  let wrapperClassName = classNames(
    'flex items-center border-2 border-black transition-colors p-1',
    // state
    {
      'justify-start bg-green-500': state === 'checked',
      'justify-center bg-gray-300': state === 'pending',
      'justify-end bg-white': state === 'unchecked',
    },
    // size
    {
      'h-6 w-10 rounded-2xl': size === 'small',
      'h-8 w-14 rounded-2xl': size === 'normal',
      'h-10 w-16 rounded-[20px]': size === 'large',
    },
    // disabled
    {
      'bg-white border-gray-500': disabled,
    },
  );

  let toggleClassName = classNames(
    'flex justify-center items-center rounded-full text-white',
    // size
    {
      'w-4 h-4': size === 'small',
      'w-6 h-6': size === 'normal',
      'w-8 h-8': size === 'large',
    },
    // disabled
    {
      'bg-black': !disabled,
      'bg-gray-400': disabled,
    },
  );

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

type ConfirmButtonProps = LoadingButtonProps & { confirmMessage: string };

export const ConfirmButton: React.FC<ConfirmButtonProps> = ({ confirmMessage, onClick, children, ...props }) => {
  const handler = async () => {
    let confirmed = window.confirm(confirmMessage);
    if (!confirmed) throw new Error('Action cancelled');
    return onClick();
  };

  return (
    <LoadingButton {...props} onClick={handler}>
      {children}
    </LoadingButton>
  );
};
