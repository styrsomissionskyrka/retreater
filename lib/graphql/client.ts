/* eslint-disable no-restricted-imports */
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { mergeDeep } from '@apollo/client/utilities';
import { useMemo } from 'react';

import { TypedTypePolicies } from './generated-apollo-helpers';
import fragmentMatch from './generated-cache';

let cachedClient: ApolloClient<NormalizedCacheObject> | undefined;

export function initializeApolloCache() {
  const typePolicies: TypedTypePolicies = {};

  const cache = new InMemoryCache({ typePolicies, possibleTypes: fragmentMatch.possibleTypes });
  return cache;
}

interface ApolloClientOptions {
  /**
   * Initial state is used client side to restore the Apollo cache with data
   * already fetched while server rendering.
   */
  initialState?: NormalizedCacheObject;
}

export function createApolloClient({ initialState }: ApolloClientOptions, cache = true) {
  let client = cachedClient;

  if (client == null) {
    client = new ApolloClient({
      uri: '/api/graphql',
      cache: initializeApolloCache(),
      ssrMode: typeof window === 'undefined',
      credentials: 'same-origin',
    });
  }

  if (initialState != null) {
    const existingCache = client.extract();
    const data = mergeDeep(initialState, existingCache);
    client.cache.restore(data);
  }

  if (cache) cachedClient = client;

  return client;
}

export function useAppClient({ initialState }: ApolloClientOptions) {
  return useMemo(() => createApolloClient({ initialState }), [initialState]);
}
