import { useMediaQuery } from '@fransvilhelm/hooks';

const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

type Breakpoint = keyof typeof breakpoints;

export function useBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]})`);
}

export function useBreakpoints(): Record<Breakpoint, boolean> {
  const breaks: Partial<Record<Breakpoint, boolean>> = {};
  for (let key of Object.keys(breakpoints) as Breakpoint[]) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    breaks[key] = useBreakpoint(key);
  }
  return breaks as Record<Breakpoint, boolean>;
}
