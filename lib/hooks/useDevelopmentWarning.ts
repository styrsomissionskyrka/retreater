import { useEffect, useRef } from 'react';

import { warning } from '../utils/assert';

type WarningHook = (...args: Parameters<typeof warning>) => void;

let useDevelopmentWarning: WarningHook;

if (process.env.NODE_ENV !== 'production') {
  useDevelopmentWarning = (value, message) => {
    let hasWarnedRef = useRef(false);
    useEffect(() => {
      if (!hasWarnedRef.current) {
        warning(value, message);
        hasWarnedRef.current = true;
      }
    }, [message, value]);
  };
} else {
  useDevelopmentWarning = () => {};
}

export { useDevelopmentWarning };
