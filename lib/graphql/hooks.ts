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
  ApolloError,
} from '@apollo/client';
import { useInView } from '@fransvilhelm/hooks';

import { namedOperations } from './generated-apollo-helpers';

export * from '@apollo/client';

type StatefulQueryResult<Data = any> =
  | { state: 'loading'; error: undefined; data: undefined }
  | { state: 'error'; error: ApolloError; data: undefined }
  | { state: 'success'; error: undefined; data: Data };

type ExtendedQueryResult<Data = any, Variables = OperationVariables> = Omit<
  QueryResult<Data, Variables>,
  'data' | 'error'
> &
  StatefulQueryResult<Data>;

export function useQuery<Data = any, Variables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<Data, Variables>,
  options: QueryHookOptions<Data, Variables> = {},
): ExtendedQueryResult<Data, Variables> {
  let result = _useQuery<Data, Variables>(query, options);

  let state: StatefulQueryResult<Data>;

  if (result.error != null) {
    state = { state: 'error', error: result.error, data: undefined };
  } else if (result.data != null) {
    state = { state: 'success', error: undefined, data: result.data };
  } else {
    state = { state: 'loading', error: undefined, data: undefined };
  }

  return { ...result, ...state };
}

export function useIntersectingQuery<Data = any, Variables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<Data, Variables>,
  options: QueryHookOptions<Data, Variables> & { ref: React.RefObject<HTMLElement> },
) {
  const inView = useInView(options.ref);
  return useQuery<Data, Variables>(query, { ...options, skip: !inView || options.skip });
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
