// eslint-disable-next-line no-restricted-imports
import { useEffect, useLayoutEffect } from 'react';

import { canUseDOM } from '../utils/dom';

export const useIsomorphicLayoutEffect = canUseDOM() ? useLayoutEffect : useEffect;
