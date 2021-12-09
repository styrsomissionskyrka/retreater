import { useCallback, useState } from 'react';
import { useIsMounted } from '@fransvilhelm/hooks';

export function useSafeState<T>(init: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
  const isMounted = useIsMounted();
  const [state, _setState] = useState(init);

  const setState: React.Dispatch<React.SetStateAction<T>> = useCallback(
    (action) => {
      if (isMounted()) _setState(action);
    },
    [isMounted],
  );

  return [state, setState];
}
