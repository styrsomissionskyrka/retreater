import { NextPage } from 'next';
import { IconCalendarEvent, IconUsers } from '@tabler/icons';
import { authenticatedPage, authenticatedSSP } from 'lib/auth/hocs';
import { AdminLayout, NavLinkConfig } from 'lib/components';
import { useUserHasRoles } from 'lib/hooks';
import { compact } from 'lib/utils/array';

const Admin: NextPage = () => {
  const isAdmin = useUserHasRoles(['admin', 'superadmin']);
  const navLinks: NavLinkConfig[] = compact([
    { href: '/admin/retreater', label: 'Retreater', icon: <IconCalendarEvent size={16} /> },
    isAdmin ? { href: '/admin/anvandare', label: 'Användare', icon: <IconUsers size={16} /> } : null,
  ]);

  return (
    <AdminLayout title="Dashboard" navLinks={navLinks}>
      {null}
    </AdminLayout>
  );
};

export default authenticatedPage(Admin);
export const getServerSideProps = authenticatedSSP();
