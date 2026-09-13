import { request } from '@/api/client';
import type { PageData } from '@/api/envelope';
import type { UserInfo, UserSource } from '@/types/identityhub';

export type UserListData = PageData & { list: UserInfo[] };

export interface ListUsersParams {
  keyword?: string;
  page?: number;
  page_size?: number;
  search_fields?: string[];
  directory_code?: string;
  organization_code?: string;
  source?: UserSource;
  status?: string;
  is_locked?: boolean;
  sort_by?: string;
  descending?: string;
}

/** 成员列表 —— `keyword` 命中 name/email/phone/description 模糊匹配。 */
export function list_users(params: ListUsersParams): Promise<UserListData> {
  return request<UserListData>('/identityhub/v1/users/list', { params });
}

export function get_user(user_code: string): Promise<UserInfo> {
  return request<UserInfo>('/identityhub/v1/users/get', { params: { user_code } });
}

export interface CreateUserInput {
  directory_code: string;
  organization_code?: string;
  /** 登录账号 / 显示名，目录域内唯一。 */
  name: string;
  email?: string;
  country_code?: string;
  phone?: string;
  description?: string;
  status: 'enable' | 'disable';
  password: string;
  user_role_codes?: string[];
  must_change_password?: boolean;
}

export function create_user(data: CreateUserInput): Promise<{ user_code: string }> {
  return request<{ user_code: string }>('/identityhub/v1/users/create', {
    method: 'POST',
    body: data,
  });
}

/** 部分更新（§1.5）—— 空 = 不修改；`source != local` 时身份字段由后端拒绝。 */
export interface UpdateUserInput {
  name?: string;
  email?: string;
  country_code?: string;
  phone?: string;
  description?: string;
  organization_code?: string;
  is_locked?: boolean;
  user_role_codes?: string[];
  must_change_password?: boolean;
}

export function update_user(user_code: string, data: UpdateUserInput): Promise<void> {
  return request<void>('/identityhub/v1/users/update', {
    method: 'PUT',
    body: { user_code, ...data },
  });
}

export function delete_user(user_code: string): Promise<void> {
  return request<void>('/identityhub/v1/users/delete', {
    method: 'DELETE',
    body: { user_code },
  });
}

export function update_user_status(user_code: string, status: 'enable' | 'disable'): Promise<void> {
  return request<void>('/identityhub/v1/users/status', {
    method: 'PUT',
    body: { user_code, status },
  });
}
