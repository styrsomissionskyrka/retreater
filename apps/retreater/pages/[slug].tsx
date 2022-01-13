import {
  GetStaticPaths,
  GetStaticPropsContext,
  GetStaticProps,
  NextPage,
} from 'next';

import { BlockRenderer } from '../components';
import { fetchPost, fetchPosts } from '../lib/api/posts';
import { Post, Revision } from '../lib/api/schema';

type Props = {
  post: Post | Revision;
};

type Query = {
  slug: string;
};

const Retreat: NextPage<Props> = ({ post }) => {
  return (
    <article>
      <h1>{post.title.rendered}</h1>
      <BlockRenderer blocks={post.blocks} />
    </article>
  );
};

export default Retreat;

export const getStaticPaths: GetStaticPaths<Query> = async () => {
  let posts = await fetchPosts({ parameters: { status: 'publish' } });
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, Query> = async (context) => {
  let revision = context.preview ? getRevisionId(context) : null;
  let post = await fetchPost({ id: context.params?.slug!, revision });

  if (post == null) return { notFound: true };
  return { props: { post } };
};

function getRevisionId(context: GetStaticPropsContext) {
  if (context.previewData == null || typeof context.previewData !== 'object') {
    return null;
  }

  if ((context.previewData as any).type === 'revision') {
    return (context.previewData as any).id;
  }

  return null;
}
