import { useCallback, useRef, useState } from 'react';
import { useDevelopmentWarning } from './useDevelopmentWarning';

export function useControlledInput<T = any>(
  controlledValue: T | undefined,
  controlledOnChange: React.Dispatch<React.SetStateAction<T>> | undefined,
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const controlledRef = useRef(controlledValue != null);
  const [valueState, setValue] = useState(defaultValue);

  useDevelopmentWarning(
    controlledRef.current && controlledOnChange == null,
    'You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`.',
  );

  const set: React.Dispatch<React.SetStateAction<T>> = useCallback(
    (n) => {
      if (!controlledRef.current) {
        setValue(n);
      } else if (controlledOnChange != null) {
        controlledOnChange(n);
      }
    },
    [controlledOnChange],
  );

  return [controlledRef.current ? (controlledValue as T) : valueState, set];
}
