import { ManagementClient, AuthenticationClient } from 'auth0';
import { isAfter } from 'date-fns';

import { ensure } from '../../lib/utils/assert';
import { App } from './app';

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

export async function createAuth0Client(app: App) {
  let token = await getAccessToken(app);
  return new ManagementClient({ domain: domain.hostname, token });
}

async function getAccessToken(app: App) {
  let expiry = app.get('auth0AccessTokenExpiry');
  let auth0AccessToken = app.get('auth0AccessToken');

  if (auth0AccessToken && !hasExpired(expiry)) return auth0AccessToken;

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

  app.set('auth0AccessToken', result.access_token);
  // Set the token to expire one hour before its actual expiry
  app.set('auth0AccessTokenExpiry', new Date(Date.now() + result.expires_in * 1000 - 1000 * 60 * 60));

  return result.access_token;
}

function hasExpired(date: Date | null): boolean {
  if (date == null) return true;
  return isAfter(Date.now(), date);
}
