import NextAuth from 'next-auth';
import Auth0 from 'next-auth/providers/auth0';

import { ensure } from 'lib/utils/assert';

export default NextAuth({
  providers: [
    Auth0({
      clientId: ensure(process.env.AUTH0_CLIENT_ID, 'Env variable AUTH0_CLIENT_ID must be defined'),
      clientSecret: ensure(process.env.AUTH0_CLIENT_SECRET, 'Env variable AUTH0_CLIENT_SECRET must be defined'),
      issuer: ensure(process.env.AUTH0_ISSUER, 'Env variable AUTH0_ISSUER must be defined'),
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      session.user.id = token?.sub;
      return session;
    },
  },

  secret: ensure(process.env.NEXTAUTH_SECRET, 'Env variable NEXTAUTH_SECRET must be defined'),
});
