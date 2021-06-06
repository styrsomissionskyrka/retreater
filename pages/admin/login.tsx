import { NextPage } from 'next';
import { useUser } from 'lib/hooks';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Login: NextPage = () => {
  const { replace, query } = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    if (user == null) {
      if (!('Cypress' in window)) replace({ pathname: '/api/auth/login', query });
    } else {
      replace('/admin');
    }
  }, [isLoading, query, replace, user]);

  return <p>Redirecting...</p>;
};

export default Login;
