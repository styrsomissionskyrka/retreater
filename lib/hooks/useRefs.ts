import React, { useCallback, useEffect, useMemo, useRef } from 'react';

function assignRef<T>(ref: React.Ref<T>, value: T) {
  if (ref == null) return;

  if (typeof ref === 'function') {
    ref(value);
  } else {
    try {
      (ref as any).current = value;
    } catch (error) {
      throw new Error(`Cannot assign value "${value}" to ref "${ref}"`);
    }
  }
}

export function useComposedRefs<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return useCallback((node) => {
    for (let ref of refs) {
      assignRef(ref, node);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}

export function useProxyRefObject<T>(initialValue: T, ...refs: React.Ref<T>[]): React.MutableRefObject<T>;
export function useProxyRefObject<T>(initialValue: T | null, ...refs: React.Ref<T>[]): React.RefObject<T>;
export function useProxyRefObject<T = undefined>(
  initialValue: undefined,
  ...refs: React.Ref<T>[]
): React.MutableRefObject<T | undefined>;
export function useProxyRefObject<T>(initialValue: T, ...refs: React.Ref<T>[]) {
  const ref = useRef<T>(initialValue);
  const refsRef = useRef(refs);

  useEffect(() => {
    refsRef.current = refs;
  }, [refs]);

  const proxy = useMemo(() => {
    let handler: ProxyHandler<typeof ref> = {
      get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
      },
      set(target, prop, value, receiver) {
        if (prop !== 'current') {
          throw new RangeError(
            `It is not allowed to set any other property than 'current' on a ref. Tried to set '${prop.toString()}'`,
          );
        }

        for (let ref of refsRef.current) {
          if (ref == null) continue;
          if (typeof ref === 'function') {
            ref(value);
          } else if ('current' in ref) {
            Reflect.set(ref, prop, value);
          }
        }

        return Reflect.set(target, prop, value, receiver);
      },
    };

    let proxy = new Proxy(ref, handler);
    return proxy;
  }, []);

  return proxy;
}
