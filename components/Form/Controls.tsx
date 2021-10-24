import { forwardRef, useRef } from 'react';

import { ElementProps } from 'lib/utils/types';
import { useComposedRefs, useResizedTextarea } from 'lib/hooks';
import { styled } from 'styles/stitches.config';

const BaseControl = styled('input', {
  lineHeight: 1,
  height: '$10',
  flex: '1 1 0%',
  px: '$2',

  border: '1px solid $black',
  outline: 'none',

  '&:first-child': {
    roundedLeft: '$md',
  },
  '&:last-child': {
    roundedRight: '$md',
  },

  '&:disabled': {
    background: '$gray100',
    color: '$gray400',
    borderColor: '$gray500',
  },

  '&[aria-invalid="true"]': {
    borderColor: '$red500',
    borderWidth: '2px',
  },

  variants: {
    align: {
      left: {
        textAlign: 'left',
      },
      right: {
        textAlign: 'right',
      },
    },
  },

  defaultVariants: {
    align: 'left',
  },
});

export interface ControlProps {
  label?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: React.ReactNode;
}

export type LabelProps = ElementProps<'label'> & {
  input: React.ReactNode;
  error?: React.ReactNode;
  disabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};

const LabelWrapper = styled('div', {
  width: '100%',
  spaceY: '$2',
});

const LabelEl = styled('label', {
  display: 'flex',
  flexFlow: 'column nowrap',
  width: '100%',
  spaceY: '$2',
});

const InputWrapper = styled('div', {
  width: '100%',
  display: 'flex',
  alignItems: 'stretch',

  '&:focus-within': {
    outline: '$black',
    borderRadius: '$md',
  },
});

const Prefix = styled('span', {
  display: 'flex',
  alignItems: 'center',
  px: '$2',
  border: '1px solid $black',
  borderR: '$0',
  roundedLeft: '$md',
  backgroundColor: '$black',
  color: '$white',

  variants: {
    disabled: {
      true: {
        backgroundColor: '$gray500',
        borderColor: '$gray500',
      },
    },
    suffix: {
      true: {
        borderR: '$1',
        borderL: '$0',
        roundedLeft: '$none',
        roundedRight: '$md',
      },
    },
  },
});

const ErrorMessage = styled('span', {
  display: 'block',
  text: '$sm',
  color: '$red500',
});

export const Label: React.FC<LabelProps> = ({ input, children, error, disabled, prefix, suffix, ...props }) => {
  return (
    <LabelWrapper>
      <LabelEl {...props}>
        {children ? <span>{children}</span> : null}
        <InputWrapper>
          {prefix != null ? <Prefix>{prefix}</Prefix> : null}
          {input}
          {suffix != null ? <Prefix suffix>{suffix}</Prefix> : null}
        </InputWrapper>
      </LabelEl>

      {error != null ? <ErrorMessage role="alert">{error}</ErrorMessage> : null}
    </LabelWrapper>
  );
};

export type InputProps = ElementProps<'input'> & ControlProps & { align?: 'left' | 'right' };

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, prefix, suffix, error, align = 'left', disabled, ...props }, ref) => {
    let invalid = error != null;
    return (
      <Label
        error={error}
        disabled={disabled}
        prefix={prefix}
        suffix={suffix}
        input={<BaseControl {...props} ref={ref} disabled={disabled} aria-invalid={invalid} align={align} />}
      >
        {label}
      </Label>
    );
  },
);

Input.displayName = 'Form.Input';

export type TextareaProps = ElementProps<'textarea'> & ControlProps;

const TextareaEl = styled(BaseControl, {
  px: '$2',
  paddingTop: '$3',
  paddingBottom: '$2',
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, disabled, ...props }, forwardedRef) => {
    let invalid = error != null;
    let ref = useRef<HTMLTextAreaElement>(null);
    let compoundRef = useComposedRefs(ref, forwardedRef);

    useResizedTextarea(ref, { minRows: 3 });

    return (
      <Label
        error={error}
        disabled={disabled}
        input={<TextareaEl {...props} as="textarea" ref={compoundRef} disabled={disabled} aria-invalid={invalid} />}
      >
        {label}
      </Label>
    );
  },
);

Textarea.displayName = 'Form.Textarea';

export type SelectProps = ElementProps<'select'> & ControlProps;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, disabled, prefix, suffix, children, ...props }, forwardedRef) => {
    let invalid = error != null;

    return (
      <Label
        error={error}
        disabled={disabled}
        prefix={prefix}
        input={
          <BaseControl {...props} as="select" ref={forwardedRef} disabled={disabled} aria-invalid={invalid}>
            {children}
          </BaseControl>
        }
      >
        {label}
      </Label>
    );
  },
);

Select.displayName = 'Form.Select';

export type CheckboxProps = Omit<ElementProps<'input'>, 'type'> & ControlProps;

const CheckboxLabel = styled('label', {
  display: 'flex',
  flexFlow: 'row nowrap',
  spaceX: '$2',
  alignItems: 'center',
});

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, disabled, prefix, suffix, ...props }, ref) => {
    let invalid = error != null;

    return (
      <CheckboxLabel>
        <input {...props} type="checkbox" ref={ref} disabled={disabled} aria-invalid={invalid} />
        <span>{label}</span>
      </CheckboxLabel>
    );
  },
);

Checkbox.displayName = 'Form.Checkbox';
