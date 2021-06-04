import { NextPage } from 'next';
import { useUser } from 'lib/hooks';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

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
