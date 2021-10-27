import NextAuth from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

import { ensure } from 'lib/utils/assert';

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Auth0Provider({
      clientId: ensure(process.env.AUTH0_CLIENT_ID, 'Env variable AUTH0_CLIENT_ID must be defined'),
      clientSecret: ensure(process.env.AUTH0_CLIENT_SECRET, 'Env variable AUTH0_CLIENT_SECRET must be defined'),
      issuer: ensure(process.env.AUTH0_ISSUER, 'Env variable AUTH0_ISSUER must be defined'),
    }),
  ],

  jwt: {
    signingKey: ensure(process.env.JWT_SIGNING_PRIVATE_KEY, 'Env variable JWT_SIGNING_PRIVATE_KEY must be defined'),
    encryptionKey: ensure(
      process.env.JWT_AUTO_GENERATED_ENCRYPTION_KEY,
      'Env variable JWT_AUTO_GENERATED_ENCRYPTION_KEY must be defined',
    ),
  },
});
