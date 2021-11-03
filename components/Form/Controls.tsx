import { forwardRef, useRef } from 'react';
import classNames, { Argument } from 'classnames';

import { ElementProps } from 'lib/utils/types';
import { useComposedRefs, useResizedTextarea } from 'lib/hooks';

type ClassNameOptions = {
  align?: 'left' | 'right';
  invalid?: boolean;
  readOnly?: boolean;
};

const baseClassName = ({ invalid, readOnly, align = 'left' }: ClassNameOptions, ...extra: Argument[]) => {
  return classNames(
    'leading-none h-10 flex-1 px-2',
    'border border-black',
    'focus:outline-none',
    'first:rounded-l-md last:rounded-r-md',
    'disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-500',
    readOnly && 'bg-gray-100 text-gray-400 border-gray-500',
    invalid && 'border-red-500 border-2',

    {
      'text-left': align === 'left',
      'text-right': align === 'right',
    },
    ...extra,
  );
};

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

export const Label: React.FC<LabelProps> = ({ input, children, error, disabled, prefix, suffix, ...props }) => {
  let className = classNames(
    'flex items-center px-2 border border-black bg-black text-white',
    'first:border-r-0 first:rounded-l-md',
    'last:border-l-0 last:rounded-r-md',
    disabled && 'bg-gray-500 border-gray-500',
  );

  return (
    <div className="w-full space-y-2">
      <label {...props} className={classNames(props.className, 'flex flex-col w-full space-y-2')}>
        {children ? <span>{children}</span> : null}
        <div className="w-full flex items-stretch focus-within:outline-black rounded-md">
          {prefix != null ? <span className={className}>{prefix}</span> : null}
          {input}
          {suffix != null ? <span className={className}>{suffix}</span> : null}
        </div>
      </label>

      {error != null ? (
        <span role="alert" className="block text-sm text-red-500">
          {error}
        </span>
      ) : null}
    </div>
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
        input={
          <input
            {...props}
            ref={ref}
            disabled={disabled}
            aria-invalid={invalid}
            className={baseClassName({ invalid, readOnly: props.readOnly, align }, props.className)}
          />
        }
      >
        {label}
      </Label>
    );
  },
);

Input.displayName = 'Form.Input';

export type TextareaProps = ElementProps<'textarea'> & ControlProps;

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
        input={
          <textarea
            {...props}
            ref={compoundRef}
            disabled={disabled}
            aria-invalid={invalid}
            className={baseClassName({ invalid, readOnly: props.readOnly }, props.className, 'px-2 pt-3 pb-2')}
          />
        }
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
          <select
            {...props}
            ref={forwardedRef}
            disabled={disabled}
            aria-invalid={invalid}
            className={baseClassName({ invalid }, props.className)}
          >
            {children}
          </select>
        }
      >
        {label}
      </Label>
    );
  },
);

Select.displayName = 'Form.Select';

export type CheckboxProps = Omit<ElementProps<'input'>, 'type'> & ControlProps;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, disabled, prefix, suffix, ...props }, ref) => {
    let invalid = error != null;

    return (
      <label className="flex space-x-2 items-center">
        <input {...props} type="checkbox" ref={ref} disabled={disabled} aria-invalid={invalid} />
        <span>{label}</span>
      </label>
    );
  },
);

Checkbox.displayName = 'Form.Checkbox';
