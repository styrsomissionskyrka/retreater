import { useEffect, useLayoutEffect } from 'react';
import { canUseDOM } from 'lib/utils/dom';

export const useIsomorphicLayoutEffect = canUseDOM() ? useLayoutEffect : useEffect;
