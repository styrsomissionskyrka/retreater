import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { IconChevronUp, IconChevronDown } from '@tabler/icons';
import debounce from 'lodash.debounce';

import { QueryObject, SetParamsCallback } from 'lib/hooks';
import { assert, ensure } from 'lib/utils/assert';
import { OrderEnum } from 'lib/graphql';
import { styled } from 'styles/stitches.config';

import { Form, Button } from '..';

interface FiltersContextType<T extends QueryObject> {
  values: T;
  setValues: SetParamsCallback<T>;
}

const FiltersContext = createContext<FiltersContextType<any> | null>(null);
function useFiltersContext<T extends QueryObject>(): FiltersContextType<T> {
  return ensure(useContext(FiltersContext));
}

function useFilter<T extends QueryObject>(key: keyof T): [value: T[keyof T], setValue: (next: T[keyof T]) => void] {
  const { values, setValues } = useFiltersContext<T>();
  assert(key in values, `The query key ${key} is not available on the values.`);

  let value = values[key];
  let setValue = useCallback((next: T[keyof T]) => setValues({ [key]: next } as Partial<T>), [key, setValues]);

  return [value, setValue];
}

const FormWrapper = styled('form', {
  display: 'flex',
  alignItems: 'center',
  spaceX: '$4',
});

interface FiltersProps<T extends QueryObject> extends FiltersContextType<T> {
  children?: React.ReactNode;
}

export function Filters<T extends QueryObject>({ values, setValues, children }: FiltersProps<T>) {
  const ctx = useMemo<FiltersContextType<T>>(() => ({ values, setValues }), [setValues, values]);
  return (
    <FiltersContext.Provider value={ctx}>
      <FormWrapper onSubmit={(e) => e.preventDefault()}>{children}</FormWrapper>
    </FiltersContext.Provider>
  );
}

interface FilterBaseProps<T extends QueryObject> {
  queryKey: keyof T;
}

interface EnumFilterProps<T extends QueryObject> extends FilterBaseProps<T> {
  possibleValues: { value: string; label: React.ReactNode }[];
  label: React.ReactNode;
  allowEmpty?: boolean;
  emptyLabel?: React.ReactNode;
}

const EMPTY = '__EMPTY__' as const;

export function EnumFilter<T extends QueryObject>({
  queryKey,
  possibleValues,
  label: sharedLabel,
  allowEmpty = false,
  emptyLabel = 'Alla',
}: EnumFilterProps<T>) {
  const [value, setValue] = useFilter<T>(queryKey);

  let finalValue: NonNullable<T[keyof T]> | typeof EMPTY;
  if (allowEmpty && value == null) {
    finalValue = EMPTY;
  } else {
    finalValue = ensure(value, 'A value must be provided for EnumFilter to work.') as any;
  }

  return (
    <Form.Select
      value={finalValue as string}
      onChange={(e) => {
        if (e.target.value === EMPTY) {
          setValue(null as T[keyof T]);
        } else {
          setValue(e.target.value as T[keyof T]);
        }
      }}
    >
      {allowEmpty ? (
        <option value={EMPTY}>
          {sharedLabel} {emptyLabel}
        </option>
      ) : null}
      {possibleValues.map(({ value, label }) => (
        <option key={value} value={value}>
          {sharedLabel} {label}
        </option>
      ))}
    </Form.Select>
  );
}

Filters.EnumFilter = EnumFilter;

export function OrderFilter<T extends QueryObject>({ queryKey }: FilterBaseProps<T>) {
  const [value, setValue] = useFilter<T>(queryKey);

  return (
    <Button
      square
      size="normal"
      onClick={() => setValue((value === OrderEnum.Asc ? OrderEnum.Desc : OrderEnum.Asc) as T[keyof T])}
      iconStart={value === OrderEnum.Desc ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
    />
  );
}

Filters.OrderFilter = OrderFilter;

export function SearchFilter<T extends QueryObject>({
  queryKey,
  placeholder,
}: FilterBaseProps<T> & { placeholder: string }) {
  const [value, setValue] = useFilter<T>(queryKey);
  const [proxyValue, setProxyValue] = useState(value?.toString() ?? '');
  const debouncedSetValue = useMemo(() => debounce(setValue, 500), [setValue]);

  return (
    <Form.Input
      name={queryKey as string}
      value={proxyValue}
      placeholder={placeholder}
      onChange={(e) => {
        setProxyValue(e.currentTarget.value);
        debouncedSetValue((e.currentTarget.value === '' ? null : e.currentTarget.value) as any);
      }}
    />
  );
}

Filters.SearchFilter = SearchFilter;
