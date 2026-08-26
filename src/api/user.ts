import { request } from '@/api/client';
import type { UserInfo, UserListData } from '@/types/identityhub';

export interface ListUsersParams {
  /** 目录域 7 位数字码（作用域第二键）。 */
  domain: string;
  /** 组织过滤：按主组织/副组织匹配。 */
  org_id?: string;
  keyword?: string;
  page?: number;
  page_size?: number;
}

/**
 * 成员列表 —— 真实网关（openplatformsvr → identityhubsvr ListUser）。
 * 列表 data 为 {list, total, page, page_size}（与 Directory {total,list} 不同）。
 */
export function list_users(params: ListUsersParams): Promise<UserListData> {
  return request<UserListData>('/identityhub/v1/user/list', { params });
}

export interface SearchUserParams {
  domain: string;
  keyword: string;
  page?: number;
  page_size?: number;
}

/** 成员搜索 —— 真实网关（identityhubsvr SearchUser），按关键词匹配账号/姓名/手机号/邮箱。 */
export function search_users(params: SearchUserParams): Promise<UserListData> {
  return request<UserListData>('/identityhub/v1/user/search', { params });
}

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

/** Update 是全量覆盖非 patch —— 后端 UpdateUser 仅支持邮箱/手机/显示名（primary_org 走 SetPrimaryOrg，暂缺）。 */
export interface UpdateUserInput {
  email?: string;
  phone?: string;
  display_name?: string;
}

export function update_user(id: string, domain: string, data: UpdateUserInput): Promise<void> {
  return request<void>('/identityhub/v1/user/update', {
    method: 'PUT',
    body: { id, domain, ...data },
  });
}

export function delete_user(id: string, domain: string): Promise<void> {
  return request<void>('/identityhub/v1/user/delete', { method: 'DELETE', params: { id, domain } });
}
