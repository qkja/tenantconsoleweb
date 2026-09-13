import { request } from '@/api/client';
import type { PageData } from '@/api/envelope';
import type { UserRoleInfo, UserRoleMemberInfo } from '@/types/identityhub';

/**
 * 用户角色（`uro`，原「安全组」）—— 挂在目录域下的用户标签，不带权限点。
 * 前缀 `/identityhub/v1/user-roles`。
 */

export type UserRoleListData = PageData & { list: UserRoleInfo[] };

export interface ListUserRolesParams {
  keyword?: string;
  page?: number;
  page_size?: number;
  search_fields?: string[];
  directory_code?: string;
  status?: string;
  sort_by?: string;
  descending?: string;
}

export function list_user_roles(params?: ListUserRolesParams): Promise<UserRoleListData> {
  return request<UserRoleListData>('/identityhub/v1/user-roles/list', { params });
}

export function get_user_role(user_role_code: string): Promise<UserRoleInfo> {
  return request<UserRoleInfo>('/identityhub/v1/user-roles/get', {
    params: { user_role_code },
  });
}

export interface CreateUserRoleInput {
  directory_code: string;
  name: string;
  description?: string;
}

export function create_user_role(data: CreateUserRoleInput): Promise<{ user_role_code: string }> {
  return request<{ user_role_code: string }>('/identityhub/v1/user-roles/create', {
    method: 'POST',
    body: data,
  });
}

export interface UpdateUserRoleInput {
  name?: string;
  description?: string;
}

export function update_user_role(user_role_code: string, data: UpdateUserRoleInput): Promise<void> {
  return request<void>('/identityhub/v1/user-roles/update', {
    method: 'PUT',
    body: { user_role_code, ...data },
  });
}

export function delete_user_role(user_role_code: string): Promise<void> {
  return request<void>('/identityhub/v1/user-roles/delete', {
    method: 'DELETE',
    body: { user_role_code },
  });
}

export function update_user_role_status(
  user_role_code: string,
  status: 'enable' | 'disable',
): Promise<void> {
  return request<void>('/identityhub/v1/user-roles/status', {
    method: 'PUT',
    body: { user_role_code, status },
  });
}

// ---- 成员（绑定方为 users.user_role_codes）----

export type UserRoleMemberListData = PageData & { list: UserRoleMemberInfo[] };

export interface ListUserRoleMembersParams {
  user_role_code: string;
  keyword?: string;
  page?: number;
  page_size?: number;
  search_fields?: string[];
  sort_by?: string;
  descending?: string;
}

export function list_user_role_members(
  params: ListUserRoleMembersParams,
): Promise<UserRoleMemberListData> {
  return request<UserRoleMemberListData>('/identityhub/v1/user-roles/members', { params });
}

export function add_user_role_members(user_role_code: string, user_codes: string[]): Promise<void> {
  return request<void>('/identityhub/v1/user-roles/members', {
    method: 'POST',
    body: { user_role_code, user_codes },
  });
}

export function remove_user_role_members(
  user_role_code: string,
  user_codes: string[],
): Promise<void> {
  return request<void>('/identityhub/v1/user-roles/members', {
    method: 'DELETE',
    body: { user_role_code, user_codes },
  });
}
