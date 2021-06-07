import { IconChevronDown, IconChevronUp } from '@tabler/icons';
import { OrderEnum } from 'lib/graphql';
import { useEffect, useState } from 'react';

export const Filters: React.FC = ({ children }) => {
  return <div>{children}</div>;
};

interface EnumFilterProps<T extends string> {
  value: T;
  possibleValues: { value: T; label: React.ReactNode }[];
  setValue: (next: T) => void;
}

export function EnumFilter<T extends string>({ value, setValue, possibleValues }: EnumFilterProps<T>) {
  return (
    <select value={value} onChange={(e) => setValue(e.target.value as T)}>
      {possibleValues.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}

interface OrderFilerProps {
  order: OrderEnum;
  setOrder: (next: OrderEnum) => void;
}

export const OrderFilter: React.FC<OrderFilerProps> = ({ order, setOrder }) => {
  return (
    <button
      type="button"
      aria-label="Ändra sorteringsordning"
      onClick={() => setOrder(order === OrderEnum.Asc ? OrderEnum.Desc : OrderEnum.Asc)}
    >
      {order === OrderEnum.Asc ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
    </button>
  );
};

interface SearchFilterProps {
  value: string;
  setValue: (next: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ value, setValue }) => {
  const [proxyValue, setProxyValue] = useState(value);

  useEffect(() => {
    setProxyValue(value);
  }, [value]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setValue(proxyValue);
      }}
    >
      <input
        aria-label="Sök retreater"
        className="border"
        type="search"
        value={proxyValue}
        onChange={(e) => {
          setProxyValue(e.target.value);
          if (e.target.value === '') setValue('');
        }}
      />
      <button type="submit">Sök</button>
    </form>
  );
};
