import { assert } from 'lib/utils/assert';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useRef } from 'react';

type TransitionOptions = { shallow?: boolean; replace?: boolean };

export type SetParamsCallback<T extends Record<string, string | number>> = (
  action: React.SetStateAction<Partial<T>>,
  options?: TransitionOptions,
) => void;

export function useSearchParams<T extends Record<string, string | number>>(initial: T): [T, SetParamsCallback<T>] {
  const initialRef = useRef(initial);
  const router = useRouter();

  const current = useMemo<T>(() => {
    const curr: any = {};

    for (let [key, initial] of Object.entries(initialRef.current)) {
      let next = router.query[key] ?? initial;
      assert(
        !Array.isArray(next),
        'Given query parameter is not string or number. useSearchParams only supports strings and numbers as values.',
      );

      curr[key] = ensureType(initial, next);
    }

    return curr as T;
  }, [router.query]);

  const setParams: SetParamsCallback<T> = useCallback(
    (action, { shallow = true, replace = false } = {}) => {
      let next: Partial<T>;
      if (typeof action === 'function') next = { ...router.query, ...action(current) };
      else next = { ...router.query, ...action };

      if (replace) {
        router.replace({ pathname: router.pathname, query: omitInitialValues(initialRef.current, next) }, undefined, {
          shallow,
        });
      } else {
        router.push({ pathname: router.pathname, query: omitInitialValues(initialRef.current, next) }, undefined, {
          shallow,
        });
      }
    },
    [current, router],
  );

  return [current, setParams];
}

function ensureType(initial: string | number, next: string | number): string | number {
  let type = typeof initial;

  switch (type) {
    case 'number':
      return Number(next);

    case 'string':
      return next.toString();

    default:
      throw new Error('Unexpected type encountered.');
  }
}

function omitInitialValues<T extends Record<string, string | number>>(initial: T, next: Partial<T>): Partial<T> {
  let copy: Partial<T> = { ...next };

  for (let [key, nextValue] of Object.entries(copy)) {
    if (nextValue === initial[key]) {
      delete copy[key];
    }
  }

  return copy as Partial<T>;
}
