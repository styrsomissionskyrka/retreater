import { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useUser } from 'lib/hooks';

const Logout: NextPage = () => {
  const { replace } = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    if (user == null) {
      replace('/');
    } else {
      replace('/api/auth/logout');
    }
  }, [isLoading, replace, user]);

  return <p>Redirecting...</p>;
};

export default Logout;
