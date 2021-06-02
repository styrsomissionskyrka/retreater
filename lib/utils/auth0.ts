import { NexusGenObjects } from 'generated/nexus-typegen';
import axios from 'axios';

export const auth0 = axios.create({
  baseURL: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2`,
  headers: { Authorization: `Bearer ${process.env.AUTH0_ACCESS_TOKEN}` },
});

export interface Auth0User {
  user_id?: string;
  email?: string;
  email_verified?: boolean;
  phone_number?: string;
  phone_verified?: string;
  created_at?: string;
  updated_at?: string;
  app_metadata?: unknown;
  user_metadata?: unknown;
  picture?: string;
  name?: string;
  nickname?: string;
  last_ip?: string;
  last_login?: string;
  logins_count?: number;
  blocked?: boolean;
  given_name?: string;
  family_name?: string;
}

export interface Auth0Role {
  id?: string;
  name?: string;
  description?: string;
}

export function createAuth0User(raw: Auth0User): NexusGenObjects['User'] {
  if (raw.user_id == null) throw new Error('User is missing user_id');
  if (raw.email == null) throw new Error('User is missing email');
  if (raw.created_at == null) throw new Error('User is missing created_at');
  if (raw.updated_at == null) throw new Error('User is missing updated_at');

  return {
    id: raw.user_id,
    email: raw.email,
    emailVerified: raw.email_verified ?? false,
    createdAt: new Date(raw.created_at).getTime(),
    updateAt: new Date(raw.updated_at).getTime(),
    name: raw.name,
    picture: raw.picture,
    lastIp: raw.last_ip,
    lastLogin: raw.last_login == null ? undefined : new Date(raw.last_login).getTime(),
    loginsCount: raw.logins_count ?? 0,
  };
}
