import { createContext, useContext } from 'react';

import { ensure } from './assert';

export function createStrictContext<T>(name: string): [React.Provider<T>, () => T] {
  const ctx = createContext<T>(null as any);
  ctx.displayName = name;

  function useStrictContext() {
    return ensure(useContext(ctx), `Could not find ${name} context`);
  }

  return [ctx.Provider, useStrictContext];
}
