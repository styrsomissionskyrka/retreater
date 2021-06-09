import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Layout } from 'lib/components';
import { authenticatedPage, authenticatedSSP } from 'lib/auth/hocs';
import { preloadQueries } from 'lib/graphql/ssr';
import { assert } from 'lib/utils/assert';
import { EditRetreat, EDIT_RETREAT_FORM_QUERY } from 'lib/forms';

const Retreat: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  assert(typeof id === 'string', 'Id not provided');

  const { data } = useQuery(EDIT_RETREAT_FORM_QUERY, { variables: { id } });
  const retreat = data?.retreat;

  if (retreat == null) return <p>Loading...</p>;

  return (
    <Layout.Admin title={'Redigera ' + retreat.title} backLink="/admin/retreater">
      <EditRetreat retreat={retreat} />
    </Layout.Admin>
  );
};

export default authenticatedPage(Retreat);
export const getServerSideProps = authenticatedSSP(
  preloadQueries([
    [
      EDIT_RETREAT_FORM_QUERY,
      (ctx) => {
        let id = ctx.query.id;
        assert(typeof id === 'string');

        return { id };
      },
    ],
  ]),
);
