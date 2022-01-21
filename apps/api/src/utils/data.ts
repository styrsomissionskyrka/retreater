import React, { useCallback, useEffect, useRef } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';

interface PostMeta {
  stripe_price: string | undefined;
}

interface Post {
  id: number;
  stripe_price: number;
  meta: PostMeta;
}

type SetState<V> = React.Dispatch<React.SetStateAction<V>>;
type StateReturn<V, SV = V> = [state: V, setState: SetState<SV>];

export function usePostAttribute<K extends keyof Post, Value extends Post[K]>(key: K): StateReturn<Value> {
  const value = useSelect<Value>((select) => select('core/editor').getEditedPostAttribute(key), [key]);

  const valueRef = useRef(value);

  const editor = useDispatch('core/editor');
  const editPost = editor.editPost as (newPost: Partial<Post>) => void;

  const setAttribute: SetState<Value> = useCallback(
    (setter) => {
      if (typeof setter === 'function') {
        editPost({ [key]: (setter as any)(valueRef.current) });
      } else {
        editPost({ [key]: setter });
      }
    },
    [editPost, key],
  );

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return [value, setAttribute];
}

export function usePostMeta(): StateReturn<PostMeta, Partial<PostMeta>> {
  const [meta, _setMeta] = usePostAttribute('meta');

  const setMeta: SetState<Partial<PostMeta>> = useCallback(
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
