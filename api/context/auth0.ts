import { PrismaClient } from '@prisma/client';
import { ManagementClient, AuthenticationClient } from 'auth0';

import { ensure } from '../../lib/utils/assert';
import { getAppConfig, updateAppConfig } from './app';

const AUTH0_MANAGEMENT_CLIENT_ID = ensure(
  process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  'Env variable AUTH0_MANAGEMENT_CLIENT_ID must be defined',
);
const AUTH0_MANAGEMENT_CLIENT_SECRET = ensure(
  process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
  'Env variable AUTH0_MANAGEMENT_CLIENT_SECRET must be defined',
);
const AUTH0_ISSUER = ensure(process.env.AUTH0_ISSUER, 'Env variable AUTH0_ISSUER must be defined');

let domain = new URL(AUTH0_ISSUER);

export async function createAuth0Client(prisma: PrismaClient) {
  let token = await getAccessToken(prisma);
  return new ManagementClient({ domain: domain.hostname, token });
}

async function getAccessToken(prisma: PrismaClient) {
  let config = await getAppConfig(prisma);
  if (config.auth0AccessToken) return config.auth0AccessToken;

  let audience = new URL('/api/v2/', AUTH0_ISSUER);

  let client = new AuthenticationClient({
    domain: domain.hostname,
    clientId: AUTH0_MANAGEMENT_CLIENT_ID,
    clientSecret: AUTH0_MANAGEMENT_CLIENT_SECRET,
  });

  let result = await client.clientCredentialsGrant({
    audience: audience.toString(),
    scope: 'read:users update:users delete:users create:users',
  });

  await updateAppConfig({ auth0AccessToken: result.access_token }, prisma);
  return result.access_token;
}
