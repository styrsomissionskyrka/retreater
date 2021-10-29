import { useSession } from 'next-auth/react';

import { useQuery, UserFieldsFragment, ME } from '../graphql';

export function useAuthenticatedUser(): Omit<UserFieldsFragment, '__typename'> {
  const session = useSession();
  const { data } = useQuery(ME, { skip: session.status !== 'authenticated' });

  if (data?.me != null) return data.me;
  if (session.status === 'authenticated') {
    return {
      id: session.data.user.id ?? '',
      email: session.data.user.email,
      name: session.data.user.name,
      picture: session.data.user.image,
    };
  }

  throw new Error('User not authorized. Make sure this hook is used only within an authenticated page.');
}
