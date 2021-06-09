import { useCallback, useRef, useState } from 'react';

export function useControlledInput<T = any>(
  controlledValue: T | undefined,
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const controlledRef = useRef(controlledValue != null);
  const [valueState, setValue] = useState(defaultValue);

  const set: React.Dispatch<React.SetStateAction<T>> = useCallback((n) => {
    if (!controlledRef.current) {
      setValue(n);
    }
  }, []);

  return [controlledRef.current ? (controlledValue as T) : valueState, set];
}
