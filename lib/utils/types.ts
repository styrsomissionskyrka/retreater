export type ElementProps<K extends keyof JSX.IntrinsicElements> = Omit<JSX.IntrinsicElements[K], 'key' | 'ref'>;
