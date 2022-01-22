import React, { useCallback, useEffect, useRef } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';

type SetState<V> = React.Dispatch<React.SetStateAction<V>>;
type StateReturn<V, SV = V> = [state: V, setState: SetState<SV>];

export function usePostAttribute<Item extends Record<string, unknown>>(key: keyof Item): StateReturn<Item[typeof key]> {
  const value = useSelect<Item[typeof key]>((select) => select('core/editor').getEditedPostAttribute(key), [key]);

  const valueRef = useRef(value);

  const { editPost } = useDispatch('core/editor');

  const setAttribute: SetState<Item[typeof key]> = useCallback(
    (next) => {
      if (isStateSetterFn<Item[typeof key]>(next)) {
        editPost({ [key]: next(valueRef.current) });
      } else {
        editPost({ [key]: next });
      }
    },
    [editPost, key],
  );

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return [value, setAttribute];
}

export function usePostMeta<Meta extends Record<string, unknown> = Record<string, unknown>>(): StateReturn<
  Meta,
  Partial<Meta>
> {
  const [meta, _setMeta] = usePostAttribute<{ meta: Meta }>('meta');

  const setMeta: SetState<Partial<Meta>> = useCallback(
    (next) => {
      _setMeta((prev) => {
        if (typeof next === 'function') return { ...prev, ...next(prev) };
        return { ...prev, ...next };
      });
    },
    [_setMeta],
  );

  return [meta, setMeta];
}

function isStateSetterFn<Value>(next: unknown): next is SetState<Value> {
  return typeof next === 'function';
}
