import { request } from '@/api/client';
import type { SessionPayload, TokenData } from '@/types/auth';

/**
 * 租户管理员认证 —— authnexus 域（前缀 `/authnexus/v1/tenant`）。
 * 登录凭证 = 名称（name），不用手机号（contract-design §5.6）。
 */

export interface TenantLoginParams {
  /** 登录账号 = 租户管理员名称（全局唯一）。 */
  name: string;
  password: string;
}

export function login(params: TenantLoginParams): Promise<SessionPayload> {
  // skip_auth_refresh：登录失败返回 1004 = 账号或密码错误，不得被 401 自动刷新吞掉。
  return request<SessionPayload>('/authnexus/v1/tenant/login', {
    method: 'POST',
    body: params,
    skip_auth_refresh: true,
  });
}

/** 刷新会话（httpOnly cookie 重建）。client.ts 的 401 自动刷新已复用此路径。 */
export function refresh_session(): Promise<TokenData> {
  return request<TokenData>('/authnexus/v1/tenant/refresh', {
    method: 'POST',
    skip_auth_refresh: true,
  });
}

export function logout(): Promise<void> {
  return request<void>('/authnexus/v1/tenant/logout', { method: 'POST' });
}

export interface ChangePasswordParams {
  old_password: string;
  new_password: string;
}

export function change_password(params: ChangePasswordParams): Promise<void> {
  return request<void>('/authnexus/v1/tenant/password', {
    method: 'PUT',
    body: params,
  });
}
