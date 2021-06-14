import { createContext, useContext } from 'react';

import { ensure } from './assert';

export function createStrictContext<T>(name: string): [React.Context<T>['Provider'], () => T] {
  const ctx = createContext<T>(null as any);
  ctx.displayName = name;

  function useStrictContext() {
    return ensure(useContext(ctx));
  }

  return [ctx.Provider, useStrictContext];
}
