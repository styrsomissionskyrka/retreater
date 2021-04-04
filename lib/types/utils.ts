/**
 * ElementProps can be used as an easier way of getting the expected props of a
 * dom element.
 */
export type ElementProps<K extends keyof JSX.IntrinsicElements> = Omit<
  JSX.IntrinsicElements[K],
  'ref' | 'key'
>;
