import { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

export function useDebouncedState<T>(
  initial: T | (() => T),
  wait: number,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState(initial);
  const debouncedSetState = useMemo(() => debounce(setState, wait), [wait]);
  return [state, debouncedSetState];
}

export function useDebouncedValue<T>(value: T, wait: number): T {
  const [state, setState] = useDebouncedState(value, wait);
  useEffect(() => setState(value), [setState, value]);
  return state;
}
