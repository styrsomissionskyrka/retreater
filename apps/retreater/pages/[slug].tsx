import { GetStaticPaths, NextPage } from 'next';
import { useRouter } from 'next/router';

import { BlockRenderer } from '../components';
import { posts, prefetchPost, usePost } from '../lib/api/posts';
import { Post } from '../lib/api/schema';
import { getStaticPropsWithClient } from '../lib/api/ssr';

type Props = {};

type Query = {
  slug: string;
};

const Retreat: NextPage<Props> = () => {
  let router = useRouter();
  let post = usePost(router.query.slug as string);

  if (post.status === 'loading') return <p>Loading...</p>;
  if (post.status === 'error') return null;
  if (post.status === 'idle') return null;

  return (
    <article>
      <h1>{post.data.title.rendered}</h1>
      <BlockRenderer blocks={post.data.blocks} />
    </article>
  );
};

export default Retreat;

export const getStaticPaths: GetStaticPaths<Query> = async () => {
  let response = await posts.get<Post[]>('/wp/v2/posts');
  return {
    paths: response.data.map((post) => ({
      params: { slug: post.slug },
    })),
    fallback: false,
  };
};

export const getStaticProps = getStaticPropsWithClient<Props, Query>(
  async ({ params, queryClient }) => {
    await prefetchPost(queryClient, params?.slug ?? '');
    return { props: {} };
  },
);
