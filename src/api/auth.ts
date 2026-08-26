import { request } from '@/api/client';
import type { SessionPayload, SessionUser } from '@/types/auth';

/**
 * 认证接口 —— authnexussvr 为空壳（由 MSW 提供契约实现，待后端落地）。
 * 路径遵循契约文档 docs/auth-contract.md。
 * 登录模型：账号 = 租户 domain（7 位数字），无多企业选择。
 */

export interface LoginParams {
  /** 租户域标识（7 位数字），即账号。 */
  domain: string;
  password: string;
  /** 成员账号（用户认证）；租户认证（管理员）不传 —— domain 即账号。 */
  account?: string;
}

export function login(params: LoginParams): Promise<SessionPayload> {
  // skip_auth_refresh：登录失败返回 1004/1003 = 账号/企业错误，不得被 401 自动刷新吞掉。
  return request<SessionPayload>('/authnexus/v1/auth/login', {
    method: 'POST',
    body: params,
    skip_auth_refresh: true,
  });
}

/** 刷新会话（httpOnly cookie 重建）。client.ts 的 401 自动刷新已复用此路径。 */
export function refresh_session(): Promise<SessionPayload> {
  return request<SessionPayload>('/authnexus/v1/auth/refresh', {
    method: 'POST',
    skip_auth_refresh: true,
  });
}

export function logout(): Promise<void> {
  return request<void>('/authnexus/v1/auth/logout', { method: 'POST' });
}

export interface ProfileResult {
  user: SessionUser;
  permissions: string[];
}

export function get_profile(): Promise<ProfileResult> {
  return request<ProfileResult>('/authnexus/v1/auth/profile', { method: 'GET' });
}

export interface ChangePasswordParams {
  old_password: string;
  new_password: string;
}

export function change_password(params: ChangePasswordParams): Promise<void> {
  return request<void>('/authnexus/v1/auth/change-password', { method: 'POST', body: params });
}

/** 管理员重置员工密码。 */
export function set_user_password(user_id: string, new_password: string): Promise<void> {
  return request<void>('/authnexus/v1/user/set-password', {
    method: 'POST',
    body: { user_id, new_password },
  });
}
