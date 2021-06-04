import { useCallback, useMemo } from 'react';
import { useUser as useAuth0User, UserContext as Auth0UserContext, UserRole } from '@auth0/nextjs-auth0';
import { hasIntersection } from 'lib/utils/array';

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
