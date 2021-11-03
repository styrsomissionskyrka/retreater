import { useCallback } from 'react';

import { useMutation } from './hooks';
import { REMOVE_USER, INVITE_USER } from './queries';

export function useRemoveUser() {
  const [mutate, result] = useMutation(REMOVE_USER, { refetchQueries: ['AdminUsers'] });
  const removeUser = useCallback((id: string) => mutate({ variables: { id } }), [mutate]);
  return [removeUser, result] as const;
}

export function useInviteUser() {
  const [mutate, result] = useMutation(INVITE_USER, { refetchQueries: ['AdminUsers'] });
  const inviteUser = useCallback((email: string) => mutate({ variables: { email } }), [mutate]);
  return [inviteUser, result] as const;
}
