import { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';

import { Link } from '../components';
import { fetchPosts } from '../lib/api/posts';
import { Post } from '../lib/api/schema';
import { wp } from '../lib/api/wp';

interface Props {
  posts: Pick<Post, 'id' | 'title' | 'slug'>[];
}

const Home: NextPage<Props> = ({ posts }) => {
  useEffect(() => {
    console.log('wtf');
    (async () => {
      try {
        let res = await wp.get('/wp/v2/posts/1/revisions/58', {
          auth: {
            username: 'adambergman',
            password: 'Glls 0bdd AAy2 tRs9 RehK mVSy',
          },
        });
        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    })();
  });

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
  let posts = await fetchPosts({});

  return {
    props: { posts: posts.map(({ id, title, slug }) => ({ id, title, slug })) },
  };
};
