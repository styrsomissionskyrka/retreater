import { NextPage } from 'next';

import { Link } from '../components';
import { prefetchPosts, usePosts } from '../lib/api/posts';
import { getStaticPropsWithClient } from '../lib/api/ssr';

const Home: NextPage = () => {
  const posts = usePosts(null);

  return (
    <div>
      <Link href="/">Home</Link>
      <ul>
        {posts.data?.map((post) => (
          <li key={post.id}>{post.title.rendered}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

export const getStaticProps = getStaticPropsWithClient(
  async ({ queryClient }) => {
    await prefetchPosts(queryClient, null);
    return { props: {} };
  },
);
