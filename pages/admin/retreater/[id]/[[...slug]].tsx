import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { IconInfoCircle } from '@tabler/icons';

import { EditRetreatFormQuery, EditRetreatFormQueryVariables, gql, TypedDocumentNode, useQuery } from 'lib/graphql';
import { Layout } from 'lib/components';
import { authenticatedPage, authenticatedSSP } from 'lib/auth/hocs';
import { preloadQueries } from 'lib/graphql/ssr';
import { assert } from 'lib/utils/assert';
import {
  EditRetreat,
  EditRetreatMetadata,
  EditRetreatStatus,
  EDIT_RETREAT_FRAGMENT,
  EDIT_RETREAT_METADATA_FRAGMENT,
  EDIT_RETREAT_STATUS_FRAGMENT,
} from 'lib/forms';

const Retreat: NextPage = () => {
  const router = useRouter();
  const { id, slug } = router.query;
  assert(typeof id === 'string', 'Id not provided');

  const { data } = useQuery(EDIT_RETREAT_FORM_QUERY, { variables: { id } });
  const retreat = data?.retreat;

  if (retreat == null) return <p>Loading...</p>;

  const page = Array.isArray(slug) ? slug[0] : null ?? 'index';
  let form: React.ReactNode;

  switch (page) {
    case 'index':
      form = <EditRetreat retreat={retreat} />;
      break;

    case 'information':
      form = <EditRetreatMetadata metadata={retreat.metadata} />;
      break;

    default:
      form = null;
  }

  return (
    <RetreatLayout title="Redigera information" id={id}>
      {form}
    </RetreatLayout>
  );
};

export const EDIT_RETREAT_FORM_QUERY: TypedDocumentNode<EditRetreatFormQuery, EditRetreatFormQueryVariables> = gql`
  query EditRetreatForm($id: ID!) {
    retreat(id: $id) {
      ...EditRetreatFields
      ...EditRetreatStatusFields
      metadata {
        ...EditRetreatMetadataFields
      }
    }
  }

  ${EDIT_RETREAT_FRAGMENT}
  ${EDIT_RETREAT_METADATA_FRAGMENT}
  ${EDIT_RETREAT_STATUS_FRAGMENT}
`;

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

export const RetreatLayout: React.FC<{ id: string; title: React.ReactNode }> = ({ id, title, children }) => {
  const { data } = useQuery(EDIT_RETREAT_FORM_QUERY, { variables: { id } });
  const navLinks = useRetreatNavLinks(id);

  const retreat = data?.retreat;

  return (
    <Layout.Admin
      title={retreat?.name ?? ''}
      sidebarTitle={retreat?.name ?? ''}
      headerTitle={title}
      backLink="/admin/retreater"
      navLinks={navLinks}
      actions={retreat ? <EditRetreatStatus retreat={retreat} /> : null}
      shallowLinks
    >
      {children}
    </Layout.Admin>
  );
};

export function useRetreatNavLinks(id: string): Layout.NavLinkConfig[] {
  let base = `/admin/retreater/${id}`;
  return [
    { label: 'Retreat', href: base, icon: <IconInfoCircle size={16} /> },
    { label: 'Information', href: `${base}/information`, icon: <IconInfoCircle size={16} /> },
  ];
}
