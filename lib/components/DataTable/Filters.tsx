import { createContext, useContext, useMemo } from 'react';
import { IconChevronUp, IconChevronDown } from '@tabler/icons';
import { SetParamsCallback } from 'lib/hooks';
import { assert, ensure } from 'lib/utils/assert';
import { OrderEnum } from 'lib/graphql';

interface FiltersContextType<T extends Record<string, string | number>> {
  values: T;
  setValues: SetParamsCallback<T>;
}

const FiltersContext = createContext<FiltersContextType<any> | null>(null);
function useFiltersContext<T extends Record<string, string | number>>(): FiltersContextType<T> {
  return ensure(useContext(FiltersContext));
}

function useFilter<T extends Record<string, string | number>>(
  key: keyof T,
): [value: T[keyof T], setValue: (next: T[keyof T]) => void] {
  const { values, setValues } = useFiltersContext<T>();
  assert(key in values, `The query key ${key} is not available on the values.`);

  let value = values[key];
  let setValue = (next: T[keyof T]) => setValues({ [key]: next } as Partial<T>);

  return [value, setValue];
}

interface FiltersProps<T extends Record<string, string | number>> extends FiltersContextType<T> {
  children?: React.ReactNode;
}

export function Filters<T extends Record<string, string | number>>({ values, setValues, children }: FiltersProps<T>) {
  const ctx = useMemo<FiltersContextType<T>>(() => ({ values, setValues }), [setValues, values]);
  return (
    <FiltersContext.Provider value={ctx}>
      <div>{children}</div>
    </FiltersContext.Provider>
  );
}

interface EnumFilterProps<T extends Record<string, string | number>> {
  queryKey: keyof T;
  possibleValues: { value: string; label: React.ReactNode }[];
}

export function EnumFilter<T extends Record<string, string | number>>({
  queryKey,
  possibleValues,
}: EnumFilterProps<T>) {
  const [value, setValue] = useFilter<T>(queryKey);

  return (
    <select value={value} onChange={(e) => setValue(e.target.value as T[keyof T])}>
      {possibleValues.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}

Filters.EnumFilter = EnumFilter;

export function OrderFilter<T extends Record<string, string | number>>({ queryKey }: { queryKey: keyof T }) {
  const [value, setValue] = useFilter<T>(queryKey);

  return (
    <button
      type="button"
      className="flex items-center space-x-2"
      onClick={() => setValue((value === OrderEnum.Asc ? OrderEnum.Desc : OrderEnum.Asc) as T[keyof T])}
    >
      <span>{value === OrderEnum.Desc ? 'Stigande' : 'Fallande'}</span>
      {value === OrderEnum.Desc ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
    </button>
  );
}

Filters.OrderFilter = OrderFilter;
