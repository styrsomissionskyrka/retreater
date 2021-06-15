import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { IconInfoCircle, IconWallet } from '@tabler/icons';

import { EditRetreatFormQuery, EditRetreatFormQueryVariables, gql, TypedDocumentNode, useQuery } from 'lib/graphql';
import { Layout } from 'lib/components';
import { authenticatedPage, authenticatedSSP } from 'lib/auth/hocs';
import { preloadQueries } from 'lib/graphql/ssr';
import { assert } from 'lib/utils/assert';
import {
  CreateReatreatProduct,
  EditRetreat,
  EditRetreatStatus,
  EditRetreatPricing,
  EDIT_RETREAT_FRAGMENT,
  EDIT_RETREAT_STATUS_FRAGMENT,
  EDIT_RETREAT_PRICING_FIELDS,
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
  let actions: React.ReactNode;
  let title: string;

  switch (page) {
    case 'index':
      form = <EditRetreat retreat={retreat} />;
      actions = <EditRetreatStatus retreat={retreat} />;
      title = 'Redigera information';
      break;

    case 'priser':
      form = <EditRetreatPricing retreat={retreat} />;
      actions = <CreateReatreatProduct retreatId={retreat.id} />;
      title = 'Redigera priser';
      break;

    default:
      form = null;
      actions = <EditRetreatStatus retreat={retreat} />;
      title = 'Redigera retreat';
  }

  return (
    <RetreatLayout title={title} id={id} actions={actions}>
      {form}
    </RetreatLayout>
  );
};

export const EDIT_RETREAT_FORM_QUERY: TypedDocumentNode<EditRetreatFormQuery, EditRetreatFormQueryVariables> = gql`
  query EditRetreatForm($id: ID!) {
    retreat(id: $id) {
      ...EditRetreatFields
      ...EditRetreatStatusFields
      ...EditRetreatPricingFields
    }
  }

  ${EDIT_RETREAT_FRAGMENT}
  ${EDIT_RETREAT_STATUS_FRAGMENT}
  ${EDIT_RETREAT_PRICING_FIELDS}
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

export const RetreatLayout: React.FC<{ id: string; title: React.ReactNode; actions?: React.ReactNode }> = ({
  id,
  title,
  actions,
  children,
}) => {
  const { data } = useQuery(EDIT_RETREAT_FORM_QUERY, { variables: { id } });
  const navLinks = useRetreatNavLinks(id);

  const retreat = data?.retreat;

  return (
    <Layout.Admin
      title={retreat?.title ?? ''}
      sidebarTitle={retreat?.title ?? ''}
      headerTitle={title}
      backLink="/admin/retreater"
      navLinks={navLinks}
      actions={actions}
      shallowLinks
    >
      {children}
    </Layout.Admin>
  );
};

export function useRetreatNavLinks(id: string): Layout.NavLinkConfig[] {
  let base = `/admin/retreater/${id}`;
  return [
    { label: 'Information', href: base, icon: <IconInfoCircle size={16} /> },
    { label: 'Priser', href: base + '/priser', icon: <IconWallet size={16} /> },
  ];
}
