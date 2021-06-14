import { createContext, useContext, useMemo } from 'react';
import { IconChevronUp, IconChevronDown } from '@tabler/icons';

import { QueryObject, SetParamsCallback } from 'lib/hooks';
import { assert, ensure } from 'lib/utils/assert';
import { OrderEnum } from 'lib/graphql';

import { Button } from '../Button';

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
  let setValue = (next: T[keyof T]) => setValues({ [key]: next } as Partial<T>);

  return [value, setValue];
}

interface FiltersProps<T extends QueryObject> extends FiltersContextType<T> {
  children?: React.ReactNode;
}

export function Filters<T extends QueryObject>({ values, setValues, children }: FiltersProps<T>) {
  const ctx = useMemo<FiltersContextType<T>>(() => ({ values, setValues }), [setValues, values]);
  return (
    <FiltersContext.Provider value={ctx}>
      <form onSubmit={(e) => e.preventDefault()} className="flex items-center space-x-8">
        {children}
      </form>
    </FiltersContext.Provider>
  );
}

interface EnumFilterProps<T extends QueryObject> {
  queryKey: keyof T;
  possibleValues: { value: string; label: React.ReactNode }[];
  label: React.ReactNode;
  allowEmpty?: boolean;
  emptyLabel?: React.ReactNode;
}

const EMPTY = '__EMPTY__' as const;

export function EnumFilter<T extends QueryObject>({
  queryKey,
  possibleValues,
  label,
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
    <label>
      <span>{label}</span>
      <select
        value={finalValue as string}
        onChange={(e) => {
          if (e.target.value === EMPTY) {
            setValue(null as T[keyof T]);
          } else {
            setValue(e.target.value as T[keyof T]);
          }
        }}
      >
        {allowEmpty ? <option value={EMPTY}>{emptyLabel}</option> : null}
        {possibleValues.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}

Filters.EnumFilter = EnumFilter;

export function OrderFilter<T extends QueryObject>({ queryKey }: { queryKey: keyof T }) {
  const [value, setValue] = useFilter<T>(queryKey);

  return (
    <Button
      className="flex items-center space-x-2"
      onClick={() => setValue((value === OrderEnum.Asc ? OrderEnum.Desc : OrderEnum.Asc) as T[keyof T])}
      iconStart={value === OrderEnum.Desc ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
    >
      {value === OrderEnum.Desc ? 'Stigande' : 'Fallande'}
    </Button>
  );
}

Filters.OrderFilter = OrderFilter;
