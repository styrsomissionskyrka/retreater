import { ParsedUrlQuery } from 'querystring';

import { useRouter } from 'next/router';
import { useCallback, useMemo, useRef } from 'react';

type TransitionOptions = { shallow?: boolean; replace?: boolean };

export type QueryObject = Record<string, string | number | boolean | null>;

export type SetParamsCallback<T extends QueryObject> = (
  action: React.SetStateAction<Partial<T>>,
  options?: TransitionOptions,
) => void;

export function useSearchParams<T extends QueryObject>(initial: T): [T, SetParamsCallback<T>] {
  const initialRef = useRef(initial);
  const router = useRouter();

  const current = useMemo<T>(() => extractCurrentParams(router.query, initialRef.current), [router.query]);

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

export function extractCurrentParams<T extends QueryObject>(query: ParsedUrlQuery, initial: T): T {
  const curr: any = {};

  for (let [key, value] of Object.entries(initial)) {
    let next = query[key];
    if (Array.isArray(next)) continue;
    curr[key] = next != null ? parseValue(next) : value;
  }

  return curr as T;
}

function parseValue(value: string): string | number | boolean {
  if (!Number.isNaN(Number(value))) return Number(value);
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}

function omitInitialValues<T extends QueryObject>(initial: T, next: Partial<T>): Partial<T> {
  let copy: Partial<T> = { ...next };

  for (let [key, nextValue] of Object.entries(copy)) {
    if (nextValue === initial[key] || nextValue == null) {
      delete copy[key];
    }
  }

  return copy as Partial<T>;
}
