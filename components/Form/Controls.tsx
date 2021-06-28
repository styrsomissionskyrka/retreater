import { Fragment, forwardRef, useRef } from 'react';
import classNames, { Argument } from 'classnames';

import { ElementProps } from 'lib/utils/types';
import { useComposedRefs, useResizedTextarea } from 'lib/hooks';

interface ClassNameOptions {
  invalid?: boolean;
}

const createControlClassName = (opts: ClassNameOptions, ...extra: Argument[]) =>
  classNames(
    'leading-none h-10 flex-1 px-2',
    'first:rounded-l last:rounded-r',
    'outline-none',
    'disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-500',
    !opts.invalid && 'border border-black',
    opts.invalid && 'border-red-500 border-2',
    ...extra,
  );

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
  return (
    <div className="w-full space-y-2">
      <label {...props} className={classNames(props.className, 'flex flex-col space-y-2 w-full')}>
        {children ? <span>{children}</span> : null}
        <div className="w-full flex items-center focus-within:outline-black">
          {prefix != null ? (
            <span className="h-10 flex items-center px-2 border border-black border-r-0 rounded-l bg-black text-white">
              {prefix}
            </span>
          ) : null}

          {input}

          {suffix != null ? (
            <span
              className={classNames(
                'h-10 flex items-center px-2 border border-l-0 rounded-r text-white',
                !disabled && 'bg-black border-black',
                disabled && 'bg-gray-500 border-gray-500',
              )}
            >
              {suffix}
            </span>
          ) : null}
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
            className={createControlClassName(
              { invalid },
              align === 'left' && 'text-left',
              align === 'right' && 'text-right',
            )}
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
            className={createControlClassName({ invalid }, 'px-2 pt-3 pb-2')}
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
        suffix={suffix}
        input={
          <select
            {...props}
            ref={forwardedRef}
            disabled={disabled}
            aria-invalid={invalid}
            className={createControlClassName({ invalid })}
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
      <label className="flex flex-row space-x-2 items-center">
        <input {...props} type="checkbox" ref={ref} disabled={disabled} aria-invalid={invalid} />
        <span>{label}</span>
      </label>
    );
  },
);

Checkbox.displayName = 'Form.Checkbox';
