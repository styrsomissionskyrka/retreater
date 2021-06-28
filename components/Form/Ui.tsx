import React, { forwardRef, useRef } from 'react';
import classNames from 'classnames';

import { ElementProps } from 'lib/utils/types';
import { useComposedRefs, useResizedTextarea } from 'lib/hooks';

import { Button, ButtonProps } from '../Button';
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

export type SubmitProps = Omit<ElementProps<'button'>, 'type'> & ButtonProps & { isSubmitting?: boolean };

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
