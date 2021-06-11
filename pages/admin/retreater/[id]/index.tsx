import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { IconInfoCircle } from '@tabler/icons';

import { useQuery } from 'lib/graphql';
import { Layout } from 'lib/components';
import { authenticatedPage, authenticatedSSP } from 'lib/auth/hocs';
import { preloadQueries } from 'lib/graphql/ssr';
import { assert } from 'lib/utils/assert';
import { EditRetreat, EDIT_RETREAT_FORM_QUERY, EditRetreatType } from 'lib/forms';

const Retreat: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  assert(typeof id === 'string', 'Id not provided');

  const { data } = useQuery(EDIT_RETREAT_FORM_QUERY, { variables: { id } });
  const retreat = data?.retreat;

  if (retreat == null) return <p>Loading...</p>;

  return (
    <RetreatLayout title={`Redigera ${retreat.title}`} retreat={retreat}>
      <EditRetreat retreat={retreat} />
    </RetreatLayout>
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

export const RetreatLayout: React.FC<{ retreat: EditRetreatType; title: React.ReactNode }> = ({
  retreat,
  title,
  children,
}) => {
  const navLinks = useRetreatNavLinks(retreat.id);

  return (
    <Layout.Admin
      title={retreat.title}
      sidebarTitle="Retreat"
      headerTitle={title}
      backLink="/admin/retreater"
      navLinks={navLinks}
    >
      {children}
    </Layout.Admin>
  );
};

export function useRetreatNavLinks(id: string): Layout.NavLinkConfig[] {
  let base = `/admin/retreater/${id}`;
  return [{ label: 'Info', href: base, icon: <IconInfoCircle size={16} /> }];
}
