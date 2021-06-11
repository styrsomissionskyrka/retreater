import { createContext, useCallback, useContext, useState } from 'react';
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
import { format, parse, getTime } from 'lib/utils/date-fns';
import * as FormUI from './Form';

export * from './Form';

interface ExtendedFormContextType {
  isSubmitting: boolean;
}

const ExtendedFormContext = createContext<ExtendedFormContextType>({ isSubmitting: false });
const useExtendedForm = () => useContext(ExtendedFormContext);

interface FormProps<FormValues extends FieldValues> {
  onSubmit: SubmitHandler<FormValues>;
  children: React.ReactNode;
}

export function Form<FormValues extends FieldValues>({ onSubmit, children }: FormProps<FormValues>): JSX.Element {
  const methods = useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: SubmitHandler<FormValues> = useCallback(
    async (values) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } catch (e) {
        throw e;
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, onSubmit],
  );

  return (
    <FormProvider<FormValues> {...methods}>
      <FormUI.Form onSubmit={methods.handleSubmit(handleSubmit)}>{children}</FormUI.Form>
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

type SubmitProps = Omit<FormUI.SubmitProps, 'isSubmitting'>;

export const Submit: React.FC<SubmitProps> = ({ children, ...props }) => {
  const { isSubmitting } = useExtendedForm();
  return (
    <FormUI.Submit {...props} isSubmitting={isSubmitting}>
      {children}
    </FormUI.Submit>
  );
};

export function createConnectedFormComponents<FormValues extends FieldValues>(): {
  Form: React.ComponentType<FormProps<FormValues>>;
  Input: React.ComponentType<InputProps<FormValues>>;
  Markdown: React.ComponentType<MarkdownProps<FormValues>>;
  Submit: React.ComponentType<SubmitProps>;
} & Omit<typeof FormUI, 'Form' | 'Input' | 'Markdown' | 'Submit'> {
  return {
    ...FormUI,
    Form,
    Input,
    Markdown,
    Submit,
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
