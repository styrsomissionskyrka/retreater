/* eslint-disable no-restricted-imports */
import {
  useQuery as _useQuery,
  useLazyQuery as _useLazyQuery,
  useMutation as _useMutation,
  DocumentNode,
  QueryHookOptions,
  LazyQueryHookOptions,
  MutationHookOptions,
  QueryResult,
  QueryTuple,
  MutationTuple,
  PureQueryOptions,
} from '@apollo/client';

import { namedOperations } from './generated-apollo-helpers';

export * from '@apollo/client';

export function useQuery<Data, Variables>(
  query: DocumentNode,
  options: QueryHookOptions<Data, Variables> = {},
): QueryResult<Data, Variables> {
  return _useQuery<Data, Variables>(query, options);
}

export function useLazyQuery<Data, Variables>(
  query: DocumentNode,
  options: LazyQueryHookOptions<Data, Variables> = {},
): QueryTuple<Data, Variables> {
  return _useLazyQuery<Data, Variables>(query, options);
}

type AvailableQueries = keyof typeof namedOperations['Query'];

type ExtendedMutationHookOptions<Data, Variables> = Omit<MutationHookOptions<Data, Variables>, 'refetchQueries'> & {
  refetchQueries?:
    | Array<AvailableQueries | PureQueryOptions>
    | ((...args: any[]) => Array<AvailableQueries | PureQueryOptions>);
};

export function useMutation<Data, Variables>(
  query: DocumentNode,
  options: ExtendedMutationHookOptions<Data, Variables> = {},
): MutationTuple<Data, Variables> {
  return _useMutation<Data, Variables>(query, options);
}

export type { QueryHookOptions, LazyQueryHookOptions, MutationHookOptions };
