import { useCallback, useState } from 'react';
import {
  useForm,
  FormProvider,
  FieldValues,
  SubmitHandler,
  useFormContext,
  Path,
  RegisterOptions,
  useFormState,
  FieldError,
} from 'react-hook-form';
import get from 'lodash.get';
import { useIsMounted } from '@fransvilhelm/hooks';

import { format, parse, getTime } from 'lib/utils/date-fns';
import { createStrictContext } from 'lib/utils/context';
import { formatCents, parsePriceInput } from 'lib/utils/money';
import { composeEventHandlers } from 'lib/utils/events';

import * as FormUI from './Form';

export * from './Form';

interface ExtendedFormContextType {
  isSubmitting: boolean;
}

const [ExtendedFormProvider, useExtendedForm] = createStrictContext<ExtendedFormContextType>('ExtendedForm');

interface FormProps<FormValues extends FieldValues> {
  onSubmit: SubmitHandler<FormValues>;
  children: React.ReactNode;
}

export function Form<FormValues extends FieldValues>({ onSubmit, children }: FormProps<FormValues>): JSX.Element {
  const methods = useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMounted = useIsMounted();

  const handleSubmit: SubmitHandler<FormValues> = useCallback(
    async (values) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } catch (e) {
        throw e;
      } finally {
        if (isMounted()) setIsSubmitting(false);
      }
    },
    [isSubmitting, onSubmit, isMounted],
  );

  return (
    <FormProvider<FormValues> {...methods}>
      <ExtendedFormProvider value={{ isSubmitting }}>
        <FormUI.Form onSubmit={methods.handleSubmit(handleSubmit)}>{children}</FormUI.Form>
      </ExtendedFormProvider>
    </FormProvider>
  );
}

interface InputProps<FormValues extends FieldValues>
  extends Omit<FormUI.InputProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'defaultValue'> {
  name: Path<FormValues>;
  defaultValue: FormUI.InputProps['defaultValue'] | number;
  options?: RegisterOptions<FormValues>;
}

export function Input<FormValues extends FieldValues>({
  name,
  type,
  required,
  defaultValue: passedDefaultValue,
  options: passedOptions,
  ...props
}: InputProps<FormValues>): JSX.Element {
  const { register } = useFormContext<FormValues>();
  const { errors } = useFormState();

  let fieldError: FieldError | undefined = get(errors, name);
  let errorMessage = fieldError != null ? fieldError['message'] || DEFAULT_MESSAGES[fieldError.type] : undefined;

  let defaultValue = passedDefaultValue;
  let options: RegisterOptions<FormValues> = { required };

  switch (type) {
    case 'date':
      options.setValueAs = (date: string) => getTime(parse(date, 'yyyy-MM-dd', new Date()));
      defaultValue = typeof defaultValue === 'number' ? format(defaultValue, 'yyyy-MM-dd') : '';
      break;

    case 'number':
      options.valueAsNumber = true;
      break;
  }

  const formProps = register(name, { ...options, ...passedOptions });
  return <FormUI.Input {...props} {...formProps} type={type} defaultValue={defaultValue} error={errorMessage} />;
}

type PriceInputProps<FormValues extends FieldValues> = InputProps<FormValues> & {
  currency: string;
};

export function PriceInput<FormValues extends FieldValues>({
  name,
  type,
  required,
  defaultValue: passedDefaultValue,
  options: passedOptions,
  currency,
  ...props
}: PriceInputProps<FormValues>): JSX.Element {
  const { register } = useFormContext<FormValues>();
  const { errors } = useFormState();

  let fieldError: FieldError | undefined = get(errors, name);
  let errorMessage = fieldError != null ? fieldError['message'] || DEFAULT_MESSAGES[fieldError.type] : undefined;

  let defaultCents = Number(passedDefaultValue);
  if (Number.isNaN(defaultCents)) defaultCents = 0;
  let defaultValue = formatCents(defaultCents);

  let options: RegisterOptions<FormValues> = {
    required,
    min: props.min,
    max: props.max,
    setValueAs: (value) => {
      let parsed = parsePriceInput(value);
      return parsed?.amount ?? 0;
    },
  };
  const formProps = register(name, { ...options, ...passedOptions });

  let handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    let parsed = parsePriceInput(event.currentTarget.value);
    event.currentTarget.value = parsed?.formatted ?? '';
  };

  return (
    <FormUI.Input
      {...props}
      {...formProps}
      type="text"
      inputMode="decimal"
      defaultValue={defaultValue}
      error={errorMessage}
      suffix={currency.toUpperCase()}
      align="right"
      onBlur={composeEventHandlers(formProps.onBlur, handleBlur)}
    />
  );
}

interface MarkdownProps<FormValues extends FieldValues>
  extends Omit<FormUI.MarkdownProps, 'name' | 'value' | 'onChange' | 'onBlur'> {
  name: Path<FormValues>;
}

export function Markdown<FormValues extends FieldValues>({
  name,
  required,
  ...props
}: MarkdownProps<FormValues>): JSX.Element {
  const { register, setValue } = useFormContext<FormValues>();
  const formProps = register(name, { required });
  return (
    <FormUI.Markdown {...props} {...formProps} required={required} onChange={(next) => setValue(name, next as any)} />
  );
}

interface SelectProps<FormValues extends FieldValues>
  extends Omit<FormUI.SelectProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'defaultValue'> {
  name: Path<FormValues>;
  defaultValue: FormUI.SelectProps['defaultValue'];
  options?: RegisterOptions<FormValues>;
}

export function Select<FormValues extends FieldValues>({
  name,
  required,
  defaultValue,
  options: passedOptions,
  children,
  ...props
}: SelectProps<FormValues>): JSX.Element {
  const { register } = useFormContext<FormValues>();
  const { errors } = useFormState();

  let fieldError: FieldError | undefined = get(errors, name);
  let errorMessage = fieldError != null ? fieldError['message'] || DEFAULT_MESSAGES[fieldError.type] : undefined;

  let options: RegisterOptions<FormValues> = { required };

  const formProps = register(name, { ...options, ...passedOptions });
  return (
    <FormUI.Select {...props} {...formProps} defaultValue={defaultValue} error={errorMessage}>
      {children}
    </FormUI.Select>
  );
}

interface CheckboxProps<FormValues extends FieldValues>
  extends Omit<FormUI.CheckboxProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'defaultChecked'> {
  name: Path<FormValues>;
  defaultChecked: FormUI.CheckboxProps['defaultChecked'];
  options?: RegisterOptions<FormValues>;
}

export function Checkbox<FormValues extends FieldValues>({
  name,
  required,
  defaultChecked,
  options: passedOptions,
  children,
  ...props
}: CheckboxProps<FormValues>): JSX.Element {
  const { register } = useFormContext<FormValues>();
  const { errors } = useFormState();

  let fieldError: FieldError | undefined = get(errors, name);
  let errorMessage = fieldError != null ? fieldError['message'] || DEFAULT_MESSAGES[fieldError.type] : undefined;

  let options: RegisterOptions<FormValues> = { required };

  const formProps = register(name, { ...options, ...passedOptions });
  return <FormUI.Checkbox {...props} {...formProps} defaultChecked={defaultChecked} error={errorMessage} />;
}

type SubmitProps = Omit<FormUI.SubmitProps, 'isSubmitting'>;

export const Submit: React.FC<SubmitProps> = ({ children, ...props }) => {
  const { isSubmitting } = useExtendedForm();
  return (
    <FormUI.Submit {...props} isSubmitting={isSubmitting}>
      {children}
    </FormUI.Submit>
  );
};

interface PriceDropdownProps<FormValues extends FieldValues>
  extends SelectProps<FormValues>,
    Omit<FormUI.PriceDropdownProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'defaultValue'> {}

export function PriceDropdown<FormValues extends FieldValues>({
  retreatId,
  name,
  required,
  defaultValue,
  options: passedOptions,
  ...props
}: PriceDropdownProps<FormValues>) {
  const { register } = useFormContext<FormValues>();
  const { errors } = useFormState();

  let fieldError: FieldError | undefined = get(errors, name);
  let errorMessage = fieldError != null ? fieldError['message'] || DEFAULT_MESSAGES[fieldError.type] : undefined;

  let options: RegisterOptions<FormValues> = { required };
  const formProps = register(name, { ...options, ...passedOptions });

  return (
    <FormUI.PriceDropdown
      {...props}
      {...formProps}
      retreatId={retreatId}
      defaultValue={defaultValue}
      error={errorMessage}
    />
  );
}

export function createConnectedFormComponents<FormValues extends FieldValues>(): {
  Form: React.ComponentType<FormProps<FormValues>>;
  Input: React.ComponentType<InputProps<FormValues>>;
  PriceInput: React.ComponentType<PriceInputProps<FormValues>>;
  Markdown: React.ComponentType<MarkdownProps<FormValues>>;
  Select: React.ComponentType<SelectProps<FormValues>>;
  Checkbox: React.ComponentType<CheckboxProps<FormValues>>;
  Submit: React.ComponentType<SubmitProps>;
  PriceDropdown: React.ComponentType<PriceDropdownProps<FormValues>>;
} & Omit<typeof FormUI, 'Form' | 'Input' | 'Markdown' | 'Submit' | 'Select' | 'Checkbox' | 'PriceDropdown'> {
  return {
    ...FormUI,
    Form,
    Input,
    PriceInput,
    Markdown,
    Select,
    Checkbox,
    Submit,
    PriceDropdown,
  };
}

const DEFAULT_MESSAGES: Record<string, string> = {
  min: 'Värdet är för litet.',
  max: 'Värdet är för stort.',
  minLength: 'Värdet är för kort.',
  maxLength: 'Värdet är för långt.',
  pattern: 'Värdet matchar inte.',
  required: 'Fältet är obligatoriskt.',
  value: '',
  validate: '',
  valueAsDate: '',
  valueAsNumber: '',
  setValueAs: '',
  shouldUnregister: '',
};
