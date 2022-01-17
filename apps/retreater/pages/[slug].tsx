import { GetStaticPaths, GetStaticPropsContext, GetStaticProps, NextPage } from 'next';
import * as z from 'zod';

import { BlockRenderer } from '../components';
import { Post, Revision } from '../lib/api/schema';
import * as wp from '../lib/api/wp';

const keys = ['id', 'title', 'blocks'] as const;

type Props = {
  post: Pick<Post | Revision, typeof keys[number]>;
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
  let posts = await wp.posts({ parameters: { status: 'publish' } }, { id: true, slug: true });

  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, Query> = async (context) => {
  let id = context.params?.slug;
  if (id == null) return { notFound: true };

  let pick = { id: true, title: true, blocks: true, status: true } as const;
  let revision = context.preview ? getRevisionId(context) : null;

  let post = revision != null ? await wp.revision({ id, revision }, pick) : await wp.post({ id }, pick);
  if (post == null) return { notFound: true };

  // Post is valid if status === 'publish', or always valid if in preview mode.
  let valid = context.preview ? true : 'status' in post && post.status === 'publish';
  if (!valid) return { notFound: true };
  return { props: { post } };
};

const PreviewDataSchema = z.object({ id: z.number() });

function getRevisionId(context: GetStaticPropsContext) {
  let result = PreviewDataSchema.safeParse(context.previewData);
  if (result.success) return result.data.id;
  return null;
}
