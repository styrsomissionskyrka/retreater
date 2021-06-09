import React, { forwardRef } from 'react';
import classNames from 'classnames';

type ElProps<E extends keyof JSX.IntrinsicElements> = Omit<JSX.IntrinsicElements[E], 'ref' | 'key'>;

type FormProps = ElProps<'form'>;

export const Form = forwardRef<HTMLFormElement, FormProps>(({ children, ...props }, ref) => {
  return (
    <form {...props} ref={ref}>
      <div className="flex flex-col space-y-8 w-full">{children}</div>
    </form>
  );
});

Form.displayName = 'Form';

export const Row = forwardRef<HTMLDivElement, { children?: React.ReactNode }>(({ children }) => {
  return <div className="flex items-start space-x-8 w-full">{children}</div>;
});

Row.displayName = 'Form.Row';

type LabelProps = ElProps<'label'> & { input: React.ReactNode };

export const Label: React.FC<LabelProps> = ({ input, children, ...props }) => {
  return (
    <label {...props} className={classNames(props.className, 'flex flex-col space-y-2 w-full')}>
      <span>{children}</span>
      <div className="w-full flex">{input}</div>
    </label>
  );
};

type InputProps = ElProps<'input'> & { label: React.ReactNode; prefix?: React.ReactNode };

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, prefix, ...props }, ref) => {
  return (
    <Label
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
            className={classNames(
              'border border-black rounded leading-none h-10 flex-1 px-2',
              'even:rounded-l-none',
              'outline-none',
            )}
          />
        </div>
      }
    >
      {label}
    </Label>
  );
});

Input.displayName = 'Form.Input';

type HiddenInputProps = ElProps<'input'>;

export const HiddenInput = forwardRef<HTMLInputElement, HiddenInputProps>(({ ...props }, ref) => {
  return <input {...props} type="hidden" ref={ref} hidden />;
});

HiddenInput.displayName = 'Form.HiddenInput';
