import { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

const Logout: NextPage = () => {
  const { replace } = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') replace('/');
    if (status === 'authenticated') signOut();
  }, [replace, status]);

  return <p>Redirecting...</p>;
};

export default Logout;
