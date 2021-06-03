import { NexusGenObjects, NexusGenEnums } from 'generated/nexus-typegen';
import axios from 'axios';
import Dataloader from 'dataloader';
import { unique } from 'lib/utils/array';

export const auth0 = axios.create({
  baseURL: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2`,
  headers: { Authorization: `Bearer ${process.env.AUTH0_ACCESS_TOKEN}` },
});

export class Auth0Client {
  private client = auth0;

  public user: Dataloader<string, NexusGenObjects['User'] | null>;
  public roles: Dataloader<string, NexusGenEnums['UserRoleEnum'][]>;

  constructor() {
    this.user = new Dataloader((ids) => this.batchFetchUsers(ids));
    this.roles = new Dataloader((ids) => this.batchFetchUsersRoles(ids));
  }

  async listUsers(
    args: ListUsersArgs = {},
  ): Promise<{ pagination: Omit<ListUsersResponse, 'users'>; users: NexusGenObjects['User'][] }> {
    let sort: [string, string] = ['created_at', '1'];
    let params: Record<string, any> = {
      page: 0,
      per_page: 10,
      include_totals: true,
    };

    if (args.page != null) params.page = args.page;
    if (args.perPage != null) params.per_page = args.perPage;
    if (args.order != null) sort[1] = args.order === 'asc' ? '-1' : '1';
    if (args.orderBy != null) sort[0] = args.orderBy;
    if (args.search != null) params.q = args.search;

    params.sort = sort.join(':');

    let { data } = await this.client.get<ListUsersResponse>(`/users`, { params });
    let { users, ...pagination } = data;

    return {
      users: users.map(createAuth0User),
      pagination,
    };
  }

  private async batchFetchUsers(ids: readonly string[]): Promise<(NexusGenObjects['User'] | null)[]> {
    let uniqueIds = unique(ids);
    let users = await Promise.all(uniqueIds.map((id) => this.fetchUser(id).catch(() => null)));
    return ids.map((id) => users.find((user) => user?.id === id) ?? null);
  }

  private async fetchUser(id: string): Promise<NexusGenObjects['User'] | null> {
    try {
      let { data } = await this.client.get<Auth0User>(`/users/${id}`);
      return createAuth0User(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return null;
      throw error;
    }
  }

  private async batchFetchUsersRoles(ids: readonly string[]): Promise<NexusGenEnums['UserRoleEnum'][][]> {
    let uniqueIds = unique(ids);
    let roles = await Promise.all(uniqueIds.map((id) => this.fetchUserRoles(id).then((roles) => [id, roles] as const)));
    return ids.map((id) => roles.find((role) => role[0] === id)?.[1] ?? []);
  }

  private async fetchUserRoles(id: string): Promise<NexusGenEnums['UserRoleEnum'][]> {
    try {
      let { data } = await this.client.get<Auth0Role[]>(`/users/${id}/roles`);
      return data.map((r) => r.name as NexusGenEnums['UserRoleEnum']);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return [];
      throw error;
    }
  }
}

export interface ListUsersArgs {
  page?: number | null;
  perPage?: number | null;
  orderBy?: 'email' | 'created_at' | 'name' | null;
  order?: 'asc' | 'desc' | null;
  search?: string | null;
}

export interface ListUsersResponse {
  start: number;
  limit: number;
  length: number;
  total: number;
  users: Auth0User[];
}

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
