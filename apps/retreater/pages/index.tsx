import { GetServerSideProps, NextPage } from 'next';

import { Link } from '../components';
import * as wp from '../lib/api/wp';
import { Post } from '../lib/api/schema';

interface Props {
  posts: Pick<Post, 'id' | 'title' | 'slug'>[];
}

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <div>
      <Link href="/">Home</Link>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/${post.slug}`}>{post.title.rendered}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  let posts = await wp.posts({}, { id: true, title: true, slug: true });
  return { props: { posts: posts } };
};
