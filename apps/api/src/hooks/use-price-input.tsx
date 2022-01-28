import { useState, useEffect } from 'react';

import { formatCents, toCents } from '../utils/price';

export function usePriceInput(value: number, handleBlur: React.Dispatch<React.SetStateAction<number>>) {
  let [state, setState] = useState(() => formatCents(value));

  useEffect(() => {
    setState(formatCents(value));
  }, [value]);

  const onChange = (value: string | React.ChangeEvent<HTMLInputElement>) => {
    let val: string;
    if (typeof value !== 'string') {
      val = value.currentTarget.value;
    } else {
      val = value;
    }

    setState(val);
  };

  const onBlur = () => {
    try {
      let next = toCents(state);
      handleBlur(next);
    } catch (error) {
      // Handle error
    }
  };

  return { value: state, onChange, onBlur } as const;
}
