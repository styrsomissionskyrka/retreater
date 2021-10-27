import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

export function useAuthenticatedUser(): Session {
  const session = useSession();

  if (session.status === 'authenticated') return session.data;

  throw new Error('User not authorized. Make sure this hook is used only within an authenticated page.');
}
