import { Fragment, useState } from 'react';

import { useIsomorphicLayoutEffect } from 'lib/hooks';

export const BrowserOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setIsMounted] = useState(false);
  useIsomorphicLayoutEffect(() => setIsMounted(true), []);

  return mounted ? <Fragment>{children}</Fragment> : null;
};
