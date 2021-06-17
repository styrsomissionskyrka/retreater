import React, { forwardRef, useRef } from 'react';
import classNames from 'classnames';

import { ElementProps } from 'lib/utils/types';
import { useComposedRefs, useResizedTextarea } from 'lib/hooks';

import { Button } from '../Button';
import { Spinner } from '../Spinner';

export type FormProps = ElementProps<'form'>;

export const Form = forwardRef<HTMLFormElement, FormProps>(({ children, ...props }, ref) => {
  return (
    <form {...props} ref={ref}>
      <div className="flex flex-col space-y-8 w-full max-w-2xl">{children}</div>
    </form>
  );
});

Form.displayName = 'Form';

export const Row = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => {
    return (
      <div ref={ref} className={classNames('flex items-start space-x-8 w-full', className)}>
        {children}
      </div>
    );
  },
);

Row.displayName = 'Form.Row';

export const ActionRow = forwardRef<HTMLDivElement, { children?: React.ReactNode }>(({ children }, ref) => {
  return (
    <Row ref={ref} className="justify-end space-x-4">
      {children}
    </Row>
  );
});

ActionRow.displayName = 'Form.ActionRow';

export type LabelProps = ElementProps<'label'> & { input: React.ReactNode; error?: React.ReactNode };

export const Label: React.FC<LabelProps> = ({ input, children, error, ...props }) => {
  return (
    <div className="w-full space-y-2">
      <label {...props} className={classNames(props.className, 'flex flex-col space-y-2 w-full')}>
        {children ? <span>{children}</span> : null}
        <div className="w-full flex">{input}</div>
      </label>
      {error != null ? (
        <span role="alert" className="block text-sm text-red-500">
          {error}
        </span>
      ) : null}
    </div>
  );
};

export type InputProps = ElementProps<'input'> & {
  label?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: React.ReactNode;
  align?: 'left' | 'right';
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, prefix, suffix, error, align = 'left', disabled, ...props }, ref) => {
    let invalid = error != null;
    return (
      <Label
        error={error}
        input={
          <div className="flex items-center w-full focus-within:outline-black">
            {prefix != null ? (
              <span className="h-10 flex items-center px-2 border border-black border-r-0 rounded-l bg-black text-white">
                {prefix}
              </span>
            ) : null}
            <input
              {...props}
              ref={ref}
              disabled={disabled}
              aria-invalid={invalid}
              className={classNames(
                'leading-none h-10 flex-1 px-2',
                'first:rounded-l last:rounded-r',
                'outline-none',
                'disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-500',
                !invalid && 'border border-black',
                invalid && 'border-red-500 border-2',
                align === 'left' && 'text-left',
                align === 'right' && 'text-right',
              )}
            />
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
        }
      >
        {label}
      </Label>
    );
  },
);

Input.displayName = 'Form.Input';

export type TextareaProps = ElementProps<'textarea'> & {
  label?: React.ReactNode;
  error?: React.ReactNode;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, disabled, ...props }, forwardedRef) => {
    let invalid = error != null;
    let ref = useRef<HTMLTextAreaElement>(null);
    let compoundRef = useComposedRefs(ref, forwardedRef);

    useResizedTextarea(ref, { minRows: 3 });

    return (
      <Label
        error={error}
        input={
          <div className="flex items-center w-full focus-within:outline-black">
            <textarea
              {...props}
              ref={compoundRef}
              disabled={disabled}
              aria-invalid={invalid}
              className={classNames(
                'leading-none flex-1 px-2 pt-3 pb-2',
                'first:rounded-l last:rounded-r',
                'outline-none resize-none',
                'disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-500',
                !invalid && 'border border-black',
                invalid && 'border-red-500 border-2',
              )}
            />
          </div>
        }
      >
        {label}
      </Label>
    );
  },
);

Textarea.displayName = 'Form.Textarea';

export type SubmitProps = Omit<ElementProps<'button'>, 'type'> & { isSubmitting?: boolean };

export const Submit = forwardRef<HTMLButtonElement, SubmitProps>(({ isSubmitting, children, ...props }, ref) => {
  return (
    <Button
      {...props}
      ref={ref}
      type="submit"
      disabled={isSubmitting}
      iconStart={isSubmitting ? <Spinner size={16} /> : null}
    >
      {children}
    </Button>
  );
});

Submit.displayName = 'Form.Submit';

export type ResetProps = Omit<ElementProps<'button'>, 'type'>;

export const Reset = forwardRef<HTMLButtonElement, ResetProps>(({ children, ...props }, ref) => {
  return (
    <Button {...props} ref={ref} type="reset" variant="outline">
      {children}
    </Button>
  );
});

Reset.displayName = 'Form.Reset';
