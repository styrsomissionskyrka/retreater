/* eslint-disable @typescript-eslint/no-unused-vars */
import Auth0 from '@auth0/nextjs-auth0';

declare module '@auth0/nextjs-auth0' {
  type UserRole = 'superadmin' | 'admin' | 'editor';

  interface UserProfile {
    'https://styrsomissionskyrka.se/roles'?: UserRole[];
  }

  interface Claims {
    email?: string | null;
    email_verified?: boolean | null;
    name?: string | null;
    nickname?: string | null;
    picture?: string | null;
    sub?: string | null;
    updated_at?: string | null;
    'https://styrsomissionskyrka.se/roles'?: UserRole[];
    [key: string]: unknown; // Any custom claim which could be in the profile
  }
}
