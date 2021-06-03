import { NextPage } from 'next';
import { useUser } from '@auth0/nextjs-auth0';
import { gql, useQuery } from '@apollo/client';
import { MeQueryQuery, MeQueryQueryVariables } from 'lib/graphql';
import { withClient } from 'lib/graphql/ssr';

const ME_QUERY = gql`
  query MeQuery {
    retreats {
      retreats {
        id
        title
        createdAt
      }
    }
  }
`;

const Home: NextPage = () => {
  const { user, error, isLoading } = useUser();
  const query = useQuery<MeQueryQuery, MeQueryQueryVariables>(ME_QUERY);
  console.log({ data: query.data });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div>
        Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
      </div>
    );
  }

  return <a href="/api/auth/login">Login</a>;
};

export const getServerSideProps = withClient(async (ctx, client) => {
  await client.query({ query: ME_QUERY });
  return { props: {} };
});

export default Home;
