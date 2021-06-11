import { NextPage } from 'next';
import { IconCalendarEvent, IconUsers } from '@tabler/icons';

import { authenticatedPage, authenticatedSSP } from 'lib/auth/hocs';
import { Layout } from 'lib/components';
import { useUserHasRoles } from 'lib/hooks';
import { compact } from 'lib/utils/array';

const Users: NextPage = () => {
  const isAdmin = useUserHasRoles(['admin', 'superadmin']);
  const navLinks: Layout.NavLinkConfig[] = compact([
    { href: '/admin/retreater', label: 'Retreater', icon: <IconCalendarEvent size={16} /> },
    isAdmin ? { href: '/admin/anvandare', label: 'Användare', icon: <IconUsers size={16} /> } : null,
  ]);

  return (
    <Layout.Admin title="Användare" backLink="/admin" navLinks={navLinks}>
      {null}
    </Layout.Admin>
  );
};

export default authenticatedPage(Users);
export const getServerSideProps = authenticatedSSP();
