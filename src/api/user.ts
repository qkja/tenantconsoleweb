import { request } from '@/api/client';
import type { PageEnvelope } from '@/api/envelope';
import type { UserInfo } from '@/types/identityhub';

export interface ListUsersParams {
  domain: string;
  org_id?: string;
  page?: number;
  page_size?: number;
}

/**
 * 成员列表 —— 后端暂无 ListUser（docs/backend-gap-list.md），
 * 由 MSW 提供数据源；后端补齐后本函数直连真实网关。
 */
export function list_users(params: ListUsersParams): Promise<PageEnvelope<UserInfo>> {
  return request<PageEnvelope<UserInfo>>('/identityhub/v1/user/list', { params });
}

/**
 * 成员（User）接口。后端暂无 List/Search —— 列表数据源由 Mock 补齐
 * （阶段 5），真实网关仅 get 详情。待后端补 ListUser 后接入。
 */
export function get_user(id: string, domain: string): Promise<UserInfo> {
  return request<UserInfo>('/identityhub/v1/user/get', { params: { id, domain } });
}

export interface CreateUserInput {
  domain: string;
  username: string;
  email?: string;
  phone?: string;
  display_name?: string;
  primary_org_id?: string;
}

export function create_user(data: CreateUserInput): Promise<void> {
  return request<void>('/identityhub/v1/user/create', { method: 'POST', body: data });
}

export interface UpdateUserInput {
  email?: string;
  phone?: string;
  display_name?: string;
  primary_org_id?: string;
  avatar?: string;
}

/** Update 是全量覆盖非 patch。 */
export function update_user(id: string, domain: string, data: UpdateUserInput): Promise<void> {
  return request<void>('/identityhub/v1/user/update', {
    method: 'PUT',
    body: { id, domain, ...data },
  });
}

export function delete_user(id: string, domain: string): Promise<void> {
  return request<void>('/identityhub/v1/user/delete', { method: 'DELETE', params: { id, domain } });
}
