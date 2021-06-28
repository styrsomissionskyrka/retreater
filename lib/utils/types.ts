export type ElementProps<K extends keyof JSX.IntrinsicElements> = Omit<JSX.IntrinsicElements[K], 'key' | 'ref'>;

type PaginatedQueryType<K extends string> = {
  [key in K]: { __typename?: any; paginationMeta?: any; items: Array<unknown> };
};

export type PaginatedType<K extends string, Q extends PaginatedQueryType<K>> = NonNullable<
  NonNullable<NonNullable<NonNullable<Q[K]>['items']>[number]>
>;
