import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { gql, TypedDocumentNode, useQuery } from '@apollo/client';
import { Layout } from 'lib/components';
import { authenticatedPage, authenticatedSSP } from 'lib/auth/hocs';
import { preloadQueries } from 'lib/graphql/ssr';
import { SingleRetreatQuery, SingleRetreatQueryVariables } from 'lib/graphql';
import { assert } from 'lib/utils/assert';

const Retreat: NextPage = () => {
  const router = useRouter();
  const id = router.query.id;
  assert(typeof id === 'string', 'Id not provided');

  const { data } = useQuery(SINGLE_RETREAT, { variables: { id: router.query.id } });
  const retreat = data?.retreat;

  if (retreat == null) return <p>Loading...</p>;

  return (
    <Layout.Admin title={retreat.title} backLink="/admin/retreater">
      <pre>{JSON.stringify(retreat, null, 2)}</pre>
    </Layout.Admin>
  );
};

const SINGLE_RETREAT: TypedDocumentNode<SingleRetreatQuery, SingleRetreatQueryVariables> = gql`
  query SingleRetreat($id: ID!) {
    retreat(id: $id) {
      id
      slug
      title
      content
      status

      createdAt
      updatedAt
      createdBy {
        id
        name
        email
      }

      startDate
      endDate
      maxParticipants
    }
  }
`;

export default authenticatedPage(Retreat);
export const getServerSideProps = authenticatedSSP(
  preloadQueries<SingleRetreatQueryVariables>([
    [
      SINGLE_RETREAT,
      (ctx) => {
        let id = ctx.query.id;
        assert(typeof id === 'string');

        return { id };
      },
    ],
  ]),
);
