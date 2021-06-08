import classNames from 'classnames';
import { forwardRef } from 'react';

type ElProps<E extends keyof JSX.IntrinsicElements> = Omit<JSX.IntrinsicElements[E], 'ref' | 'key'>;

type FormProps = ElProps<'form'>;

export const Form = forwardRef<HTMLFormElement, FormProps>(({ children, ...props }, ref) => {
  return (
    <form {...props} ref={ref}>
      <div className="flex flex-col space-y-8 max-w-lg">{children}</div>
    </form>
  );
});

Form.displayName = 'Form';

type InputProps = ElProps<'input'> & { label: React.ReactNode; prefix?: React.ReactNode };

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, prefix, ...props }, ref) => {
  return (
    <label className={classNames(props.className, 'flex flex-col space-y-2')}>
      <span>{label}</span>
      <div className="w-full flex">
        {prefix != null ? <span>{prefix}</span> : null}
        <input {...props} ref={ref} className="border border-black w-full" />
      </div>
    </label>
  );
});

Input.displayName = 'Form.Input';

type HiddenInputProps = ElProps<'input'>;

export const HiddenInput = forwardRef<HTMLInputElement, HiddenInputProps>(({ ...props }, ref) => {
  return <input {...props} type="hidden" ref={ref} hidden />;
});

HiddenInput.displayName = 'Form.HiddenInput';
