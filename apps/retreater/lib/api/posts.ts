import { QueryClient, QueryFunctionContext, useQuery } from 'react-query';
import axios from 'axios';

import {
  PostSchema,
  PostListSchema,
  PostListParameterInput,
  PostListParametersSchema,
  PostListParameters,
} from './schema';

export const posts = axios.create({
  baseURL: 'http://styrsomissionskyrka-api.local/wp-json',
});

export const POST_KEYS = {
  all: () => ['posts'] as const,
  lists: () => [...POST_KEYS.all(), 'list'] as const,
  list: (parameters: PostListParameterInput | null) =>
    [...POST_KEYS.lists(), { parameters }] as const,
  details: () => [...POST_KEYS.all(), 'detail'] as const,
  detail: (idOrSlug: number | string) =>
    [...POST_KEYS.details(), idOrSlug] as const,
} as const;

async function fetchPosts({
  queryKey,
  signal,
}: QueryFunctionContext<ReturnType<typeof POST_KEYS['list']>>) {
  let [, , options] = queryKey;

  let params = PostListParametersSchema.parse(options.parameters ?? {});

  let _embed = Array.isArray(params._embed)
    ? params._embed
    : params._embed
    ? 1
    : undefined;

  let response = await posts.get(`/wp/v2/posts`, {
    params: { ...params, _embed },
    signal,
  });
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
  let [, , idOrSlug] = queryKey;

  let post: any;

  if (Number.isNaN(Number(idOrSlug))) {
    let response = await posts.get(`/wp/v2/posts`, {
      params: { slug: [idOrSlug] },
      signal,
    });

    post = response.data[0];
  } else {
    let response = await posts.get(`/wp/v2/posts/${idOrSlug}`, { signal });
    post = response.data;
  }

  return PostSchema.parse(post);
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

function emptyFilters(filters: PostListParameters): boolean {
  return Object.entries(filters).every(([_, value]) => {
    if (value == null) return true;
    if (Array.isArray(value) && value.length < 1) return true;
    if (typeof value === 'object' && Object.keys(value).length < 1) return true;
    return false;
  });
}
