import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { gql, TypedDocumentNode, useQuery } from '@apollo/client';
import { Layout, Form } from 'lib/components';
import { authenticatedPage, authenticatedSSP } from 'lib/auth/hocs';
import { preloadQueries } from 'lib/graphql/ssr';
import { SingleRetreatQuery, SingleRetreatQueryVariables } from 'lib/graphql';
import { assert } from 'lib/utils/assert';
import { format } from 'lib/utils/date-fns';

const Retreat: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  assert(typeof id === 'string', 'Id not provided');

  const { data } = useQuery(SINGLE_RETREAT, { variables: { id } });
  const retreat = data?.retreat;

  if (retreat == null) return <p>Loading...</p>;

  let startDate = format(retreat.startDate ?? new Date(), 'yyyy-MM-dd');
  let endDate = format(retreat.endDate ?? new Date(), 'yyyy-MM-dd');

  return (
    <Layout.Admin title={retreat.title} backLink="/admin/retreater">
      <Form.Form onSubmit={(e) => e.preventDefault()}>
        <Form.HiddenInput name="id" defaultValue={retreat.id} />
        <Form.Input label="Titel" name="title" type="text" defaultValue={retreat.title} />
        <Form.Input label="Slug" prefix="/retreater/" name="slug" type="text" readOnly value={retreat.slug} />
        <Form.Input label="Startdatum" name="startDate" type="date" defaultValue={startDate} />
        <Form.Input label="Slutdatum" name="endDate" type="date" defaultValue={endDate} />
        <Form.Input
          label="Max antal deltagare"
          name="maxParticipants"
          type="number"
          defaultValue={retreat.maxParticipants ?? 0}
        />
        <Form.Markdown initialValue={retreat.content} />
      </Form.Form>
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
