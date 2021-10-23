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
  OperationVariables,
  TypedDocumentNode,
} from '@apollo/client';

import { useIntersection } from '../hooks';
import { namedOperations } from './generated-apollo-helpers';

export * from '@apollo/client';

export function useQuery<Data = any, Variables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<Data, Variables>,
  options: QueryHookOptions<Data, Variables> = {},
): QueryResult<Data, Variables> {
  return _useQuery<Data, Variables>(query, options);
}

export function useIntersectingQuery<Data = any, Variables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<Data, Variables>,
  options: QueryHookOptions<Data, Variables> & { ref: React.RefObject<HTMLElement> },
): QueryResult<Data, Variables> {
  const intersection = useIntersection(options.ref);
  return _useQuery<Data, Variables>(query, { ...options, skip: !intersection?.isIntersecting || options.skip });
}

export function useLazyQuery<Data = any, Variables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<Data, Variables>,
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

export function useMutation<Data = any, Variables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<Data, Variables>,
  options: ExtendedMutationHookOptions<Data, Variables> = {},
): MutationTuple<Data, Variables> {
  return _useMutation<Data, Variables>(query, options);
}

export type { QueryHookOptions, LazyQueryHookOptions, MutationHookOptions };
