import * as z from 'zod';

import {
  PostSchema,
  PostListSchema,
  PostListParameterInput,
  PostListParametersSchema,
  RevisionSchema,
} from './schema';
import { wp } from './wp';

export const POST_KEYS = {
  all: () => ['posts'] as const,
  lists: () => [...POST_KEYS.all(), 'list'] as const,
  list: (parameters: PostListParameterInput | null) =>
    [...POST_KEYS.lists(), { parameters }] as const,
  details: () => [...POST_KEYS.all(), 'detail'] as const,
  detail: (id: number | string, revision: number | string | null = null) =>
    [...POST_KEYS.details(), id, revision] as const,
} as const;

interface FetchPostsArgs {
  parameters?: PostListParameterInput;
}

export async function fetchPosts({ parameters }: FetchPostsArgs) {
  try {
    let params = PostListParametersSchema.parse(parameters ?? {});

    let _embed = Array.isArray(params._embed)
      ? params._embed
      : params._embed
      ? 1
      : undefined;

    let response = await wp.get(`/wp/v2/posts`, {
      params: { ...params, _embed },
    });

    return PostListSchema.parse(response.data);
  } catch (error) {
    return [];
  }
}

interface FetchPostArgs {
  id: string | number;
  revision?: string | number | null;
}

export async function fetchPost({ id, revision }: FetchPostArgs) {
  try {
    let post: unknown;

    if (Number.isNaN(Number(id))) {
      let response = await wp.get(`/wp/v2/posts`, {
        params: { slug: [id] },
      });

      post = response.data[0];
    } else {
      let pathname = `/wp/v2/posts/${id}`;
      if (revision != null) pathname += `/revisions/${revision}`;

      let response = await wp.get(pathname);
      post = response.data;
    }

    if (post == null) return null;
    let schema = z.union([PostSchema, RevisionSchema]);
    return schema.parse(post);
  } catch (error) {
    return null;
  }
}
