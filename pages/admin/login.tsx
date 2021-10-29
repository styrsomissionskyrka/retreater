import { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';

const Login: NextPage = () => {
  const { replace, query } = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'authenticated') replace('/admin');
    if (status === 'unauthenticated') signIn('auth0');
  }, [query, replace, status]);

  return <p>Loading...</p>;
};

export default Login;
