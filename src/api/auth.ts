import { request } from '@/api/client';
import type { SessionPayload, SessionUser, TenantOption } from '@/types/auth';

/**
 * 认证接口 —— authnexussvr 为空壳（阶段 3 由 MSW 提供契约实现，待后端落地）。
 * 路径遵循契约文档 docs/auth-contract.md（POST /authnexus/v1/auth/...）。
 */

export interface LoginParams {
  account: string;
  password: string;
}

/** 登录返回：多企业 → tenants 列表待选；单企业 → 直接 session。 */
export interface LoginResult {
  login_ticket?: string;
  tenants?: TenantOption[];
  session?: SessionPayload;
}

export function login(params: LoginParams): Promise<LoginResult> {
  // skip_auth_refresh：登录失败返回 1004 = 密码错误，不得被 401 自动刷新吞掉。
  return request<LoginResult>('/authnexus/v1/auth/login', {
    method: 'POST',
    body: params,
    skip_auth_refresh: true,
  });
}

/** 多企业场景：凭 login_ticket + 选中的 tenant_id 换取正式会话。 */
export function select_tenant(login_ticket: string, tenant_id: string): Promise<SessionPayload> {
  return request<SessionPayload>('/authnexus/v1/auth/select-tenant', {
    method: 'POST',
    body: { login_ticket, tenant_id },
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
