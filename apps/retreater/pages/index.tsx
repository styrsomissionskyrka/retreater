import { NextPage } from 'next';

import { Link } from '../components';
import { prefetchPosts, usePosts } from '../lib/api/posts';
import { getServerSidePropsWithClient } from '../lib/api/ssr';

const Home: NextPage = () => {
  const posts = usePosts(null);

  return (
    <div>
      <Link href="/">Home</Link>
      <ul>
        {posts.data?.map((post) => (
          <li key={post.id}>
            <Link href={`/retreater/${post.slug}`}>{post.title.rendered}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

export const getServerSideProps = getServerSidePropsWithClient(
  async ({ queryClient }) => {
    await prefetchPosts(queryClient, null);
    return { props: {} };
  },
);
