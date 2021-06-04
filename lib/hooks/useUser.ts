import { useCallback, useMemo } from 'react';
import { useUser as useAuth0User, UserContext as Auth0UserContext, UserRole, UserProfile } from '@auth0/nextjs-auth0';
import { hasIntersection } from 'lib/utils/array';
import { ensure } from 'lib/utils/assert';

interface UserContext extends Auth0UserContext {
  hasRoles(roles: UserRole[]): boolean;
}

export function useUser(): UserContext {
  const ctx = useAuth0User();

  const hasRoles = useCallback(
    (roles: UserRole[]) => {
      if (ctx.user == null) return false;
      if (roles.length < 1) return true;
      let userRoles = ctx.user['https://styrsomissionskyrka.se/roles'] ?? [];
      return hasIntersection(roles, userRoles);
    },
    [ctx.user],
  );

  return useMemo<UserContext>(() => ({ ...ctx, hasRoles }), [ctx, hasRoles]);
}

export function useAuthenticatedUser(): UserProfile {
  const { user } = useUser();
  return ensure(user, 'User not authorized. Make sure this hook is used only within an authenticated page.');
}
