import React from 'react';

export function sharedRef<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return (instance) => {
    for (let ref of refs) {
      if (ref == null) continue;

      if (typeof ref === 'function') {
        ref(instance);
      } else if ('current' in ref) {
        (ref as any).current = instance;
      }
    }
  };
}
