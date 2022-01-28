import React, { useCallback, useEffect, useRef } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { Retreat, Base } from '@styrsomissionskyrka/types';

export type SetState<V> = React.Dispatch<React.SetStateAction<V>>;
export type StateReturn<V, SV = V> = [state: V, setState: SetState<SV>];

export function useAttribute<Item extends Base, Key extends keyof Item>(key: Key): StateReturn<Item[Key]> {
  const value = useSelect<Item[Key]>((select) => select('core/editor').getEditedPostAttribute(key), [key]);

  const valueRef = useRef(value);

  const { editPost } = useDispatch('core/editor');

  const setAttribute: SetState<Item[Key]> = useCallback(
    (next) => {
      if (isStateSetterFn(next)) {
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

export function useMeta<Item extends Base>(): StateReturn<Item['meta'], Partial<Item['meta']>> {
  const [meta, _setMeta] = useAttribute<Item, 'meta'>('meta');

  const setMeta: SetState<Item['meta']> = useCallback(
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

export function useRetreatAttribute<Key extends keyof Retreat>(key: Key) {
  return useAttribute<Retreat, Key>(key);
}

export function useRetreatMeta() {
  return useMeta<Retreat>();
}

function isStateSetterFn<Value>(next: unknown): next is SetState<Value> {
  return typeof next === 'function';
}
