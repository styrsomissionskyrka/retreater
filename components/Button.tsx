import { forwardRef, useRef } from 'react';

import { useControlledInput, useIsomorphicLayoutEffect, useSafeState } from 'lib/hooks';
import { composeEventHandlers } from 'lib/utils/events';
import { ElementProps } from 'lib/utils/types';
import { styled } from 'styles/stitches.config';

import { Spinner } from './Spinner';
import { VisuallyHidden } from './VisuallyHidden';
import { toast } from './Toast';

type ButtonVariant = 'default' | 'outline' | 'danger';
type ButtonSizeBase = 'small' | 'normal' | 'large';

const ButtonImpl = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  spaceX: '$2',
  lineHeight: '$none',
  borderRadius: '$md',
  '&:disabled': { cursor: 'not-allowed' },

  variants: {
    variant: {
      default: {
        background: '$black',
        color: '$white',
        '&:hover': { background: '$gray500' },
        '&:disabled': { background: '$gray500' },
      },
      outline: {
        background: '$white',
        color: '$black',
        border: '2px solid $black',
        '&:hover': { background: '$gray200' },
        '&:disabled': {
          borderColor: '$gray400',
          color: '$gray400',
          background: '$gray200',
        },
      },
      danger: {
        background: '$red500',
        color: '$white',
        '&:hover': { background: '$red700' },
        '&:disabled': { background: '$red300' },
      },
    },
    size: {
      small: {
        height: '$8',
        px: '$3',
        text: '$sm',
      },
      normal: {
        height: '$10',
        px: '$5',
      },
      large: {
        height: '$12',
        px: '$6',
      },
    },
    square: { true: { flex: 'none', padding: '$0' } },
  },
  compoundVariants: [
    {
      size: 'small',
      square: true,
      css: { width: '$8' },
    },
    {
      size: 'normal',
      square: true,
      css: { width: '$10' },
    },
    {
      size: 'large',
      square: true,
      css: { width: '$12' },
    },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'normal',
    square: false,
  },
});

export type ButtonProps = React.ComponentProps<typeof ButtonImpl> & {
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ iconStart, iconEnd, type = 'button', children, ...props }, ref) => {
    return (
      <ButtonImpl {...props} ref={ref} type={type}>
        {iconStart}
        {children ? <span>{children}</span> : null}
        {iconEnd}
      </ButtonImpl>
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

const ToggleButtonLabel = styled('label', {
  display: 'flex',
  alignItems: 'center',
  spaceX: '$2',
  '&:focus-within': { outline: '$black' },
});

const ToggleButtonWrapper = styled('div', {
  border: '2px solid $black',
  display: 'flex',
  alignItems: 'center',
  trans: 'background',

  variants: {
    state: {
      checked: { justifyContent: 'flex-start', background: '$green500' },
      unchecked: { justifyContent: 'flex-end', background: '$white' },
      pending: { justifyContent: 'center', background: '$gray300' },
    },
    size: {
      small: {
        height: '$6',
        width: '$10',
        padding: '$1',
        borderRadius: '$xl',
      },
      normal: {
        height: '$8',
        width: '$14',
        padding: '$1',
        borderRadius: '$2xl',
      },
      large: {
        height: '$10',
        width: '$16',
        padding: '$1',
        borderRadius: '20px',
      },
    },
    disabled: {
      true: {
        background: '$white',
        borderColor: '$gray500',
      },
    },
  },
});

const ToggleButtonCheck = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '$full',
  background: '$black',
  color: '$white',

  variants: {
    size: {
      small: { size: '$4' },
      normal: { size: '$6' },
      large: { size: '$8' },
    },
    disabled: {
      true: { background: '$gray400' },
    },
  },
});

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

  let spinnerSize = size === 'small' ? 10 : size === 'normal' ? 16 : 18;

  return (
    <ToggleButtonLabel>
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
      <ToggleButtonWrapper size={size} state={state} disabled={disabled}>
        <ToggleButtonCheck size={size} disabled={disabled}>
          {state === 'pending' ? <Spinner size={spinnerSize} /> : null}
        </ToggleButtonCheck>
      </ToggleButtonWrapper>
      {children ? <span>{children}</span> : null}
    </ToggleButtonLabel>
  );
};

type ConfirmButtonProps = LoadingButtonProps & { confirmMessage: string };

export const ConfirmButton: React.FC<ConfirmButtonProps> = ({ confirmMessage, onClick, children, ...props }) => {
  const handler = async () => {
    let confirmed = window.confirm(confirmMessage);
    if (confirmed) return onClick();
  };

  return <LoadingButton {...props} onClick={handler} />;
};
