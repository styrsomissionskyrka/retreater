import { QueryClient, QueryFunctionContext, useQuery } from 'react-query';
import axios from 'axios';

import {
  PostSchema,
  PostListSchema,
  PostListFilterInput,
  PostListFiltersSchema,
  PostListFilter,
} from './schema';

let api = axios.create({
  baseURL: 'http://styrsomissionskyrka-api.local/wp-json',
});

export const POST_KEYS = {
  all: () => ['posts'] as const,
  lists: () => [...POST_KEYS.all(), 'list'] as const,
  list: (filters: PostListFilterInput | null) =>
    [...POST_KEYS.lists(), { filters }] as const,
  details: () => [...POST_KEYS.all(), 'detail'] as const,
  detail: (id: number | string) =>
    [...POST_KEYS.details(), Number(id)] as const,
} as const;

async function fetchPosts({
  queryKey,
  signal,
}: QueryFunctionContext<ReturnType<typeof POST_KEYS['list']>>) {
  let [, , options] = queryKey;

  let filters = PostListFiltersSchema.parse(options.filters ?? {});
  let response = await api.get(`/wp/v2/posts`, { params: filters, signal });
  return PostListSchema.parse(response.data);
}

export function usePosts(...args: Parameters<typeof POST_KEYS.list>) {
  return useQuery(POST_KEYS.list(...args), fetchPosts);
}

export async function prefetchPosts(
  queryClient: QueryClient,
  ...args: Parameters<typeof POST_KEYS.list>
) {
  return queryClient.fetchQuery(POST_KEYS.list(...args), fetchPosts);
}

async function fetchPost({
  queryKey,
  signal,
}: QueryFunctionContext<ReturnType<typeof POST_KEYS['detail']>>) {
  let [, , id] = queryKey;
  let response = await api.get(`/wp/v2/posts/${id}`, { signal });
  return PostSchema.parse(response.data);
}

export function usePost(...args: Parameters<typeof POST_KEYS.detail>) {
  return useQuery(POST_KEYS.detail(...args), fetchPost);
}

export async function prefetchPost(
  queryClient: QueryClient,
  ...args: Parameters<typeof POST_KEYS.detail>
) {
  return queryClient.fetchQuery(POST_KEYS.detail(...args), fetchPost);
}

function emptyFilters(filters: PostListFilter): boolean {
  return Object.entries(filters).every(([_, value]) => {
    if (value == null) return true;
    if (Array.isArray(value) && value.length < 1) return true;
    if (typeof value === 'object' && Object.keys(value).length < 1) return true;
    return false;
  });
}
