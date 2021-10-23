import React, { forwardRef } from 'react';

import { ElementProps } from 'lib/utils/types';
import { styled } from 'styles/stitches.config';

import { Button, ButtonProps } from '../Button';
import { Spinner } from '../Spinner';

export type FormProps = ElementProps<'form'>;

const FormWrapper = styled('div', {
  display: 'flex',
  flexFlow: 'column',
  spaceY: '$8',
  width: '100%',
  maxWidth: '$max2xl',
});

export const Form = forwardRef<HTMLFormElement, FormProps>(({ children, ...props }, ref) => {
  return (
    <form {...props} ref={ref}>
      <FormWrapper>{children}</FormWrapper>
    </form>
  );
});

Form.displayName = 'Form';

export const Row = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  spaceX: '$8',
  width: '100%',
});

Row.displayName = 'Form.Row';

export const ActionRow = styled(Row, { justifyContent: 'flex-end', spaceX: '$4' });
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
