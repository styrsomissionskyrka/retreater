import axios from 'axios';
import * as z from 'zod';
import { Post, PostSchema } from '@styrsomissionskyrka/types';

import * as config from '../config';
import { PostListParameterInput, PostListParametersSchema } from './schema';

type Mask<T> = {
  [k in keyof T]?: true;
};

type PickMask<M, T> = {
  [k in keyof M]: k extends keyof T ? T[k] : never;
};

export const wp = axios.create({
  baseURL: new URL('/wp-json', config.url.api).toString(),
  auth:
    typeof window === 'undefined'
      ? {
          username: process.env.WP_AUTH_USER!,
          password: process.env.WP_AUTH_PASSWORD!,
        }
      : undefined,
});

interface SharedArguments<Parameters extends Record<string, unknown>, Item extends Record<string, unknown>> {
  parameters?: Parameters;
  embed?: boolean | (keyof Item)[];
}

export interface FetchPostsArgs extends SharedArguments<PostListParameterInput, Post> {}

export async function posts<M extends Mask<Post>>(args: FetchPostsArgs): Promise<Post[]>;
export async function posts<M extends Mask<Post>>(args: FetchPostsArgs, pick?: M): Promise<PickMask<M, Post>[]>;
export async function posts<M extends Mask<Post>>({ parameters, embed }: FetchPostsArgs, pick?: M) {
  let params = parameters ? PostListParametersSchema.parse(parameters) : {};

  let _embed = typeof embed === 'boolean' ? 1 : embed;
  let _fields = pick != null ? Object.keys(pick) : undefined;

  let result = await wp.get(`/wp/v2/posts`, {
    params: { ...params, _embed, _fields },
  });

  if (pick != null) return z.array(PostSchema.pick(pick)).parse(result.data);
  return z.array(PostSchema).parse(result.data);
}

export interface FetchPostArgs extends SharedArguments<{}, Post> {
  id: string | number;
}

export async function post<M extends Mask<Post>>(params: FetchPostArgs): Promise<Post | null>;
export async function post<M extends Mask<Post>>(params: FetchPostArgs, pick: M): Promise<PickMask<M, Post> | null>;
export async function post<M extends Mask<Post>>({ id, embed }: FetchPostArgs, pick?: M) {
  let post: unknown;

  let _embed = typeof embed === 'boolean' ? 1 : embed;
  let _fields = pick != null ? Object.keys(pick) : undefined;

  if (typeof id === 'string' && Number.isNaN(Number(id))) {
    [post] = await posts({ parameters: { slug: [id] }, embed }, pick);
  } else {
    let result = await wp.get(`/wp/v2/posts/${id}`, { params: { _embed, _fields } });
    post = result.data;
  }

  if (post == null) return null;

  if (pick != null) return PostSchema.pick(pick).parse(post);
  return PostSchema.parse(post);
}

export interface FetchRevisionArgs extends SharedArguments<{}, Post> {
  id: string | number;
  revision: string | number;
}

export async function revision<M extends Mask<Post>>(args: FetchRevisionArgs): Promise<Post | null>;
export async function revision<M extends Mask<Post>>(
  args: FetchRevisionArgs,
  pick: M,
): Promise<PickMask<M, Post> | null>;
export async function revision<M extends Mask<Post>>({ id, revision, embed }: FetchRevisionArgs, pick?: M) {
  let _embed = typeof embed === 'boolean' ? 1 : embed;
  let _fields = pick != null ? Object.keys(pick) : undefined;
  let result = await wp.get(`/wp/v2/posts/${id}/revisions/${revision}`, { params: { _embed, _fields } });

  if (result.data == null) return null;

  if (pick != null) return PostSchema.pick(pick).parse(result.data);
  return PostSchema.parse(result.data);
}
