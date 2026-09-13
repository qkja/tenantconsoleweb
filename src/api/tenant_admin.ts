import { request } from '@/api/client';
import type { PageData } from '@/api/envelope';
import type { LockWindowUnit, TenantAdminInfo } from '@/types/tenantmanager';

/**
 * 租户管理员（`tnu`）—— 租户侧管理账号，登录凭证 = name（姓名兼登录账号）。
 * 前缀 `/tenantmanager/v1/tenant-admins`。
 * 兜底约束：删 / 停用 / 解绑若破坏「至少保留一个启用的超级管理员」，后端拒绝。
 */

export type TenantAdminListData = PageData & { list: TenantAdminInfo[] };

export interface ListTenantAdminsParams {
  keyword?: string;
  page?: number;
  page_size?: number;
  search_fields?: string[];
  role_code?: string;
  status?: string;
  sort_by?: string;
  descending?: string;
}

export function list_tenant_admins(
  params?: ListTenantAdminsParams,
): Promise<TenantAdminListData> {
  return request<TenantAdminListData>('/tenantmanager/v1/tenant-admins/list', { params });
}

export function get_tenant_admin(tenant_admin_code: string): Promise<TenantAdminInfo> {
  return request<TenantAdminInfo>('/tenantmanager/v1/tenant-admins/get', {
    params: { tenant_admin_code },
  });
}

export interface CreateTenantAdminInput {
  name: string;
  country_code?: string;
  phone?: string;
  email?: string;
  password: string;
  role_codes?: string[];
  must_change_password?: boolean;
  status: 'enable' | 'disable';
  max_login_failures?: number;
  login_fail_window?: number;
  login_fail_window_unit?: LockWindowUnit;
  is_locked?: boolean;
}

export function create_tenant_admin(
  data: CreateTenantAdminInput,
): Promise<{ tenant_admin_code: string }> {
  return request<{ tenant_admin_code: string }>('/tenantmanager/v1/tenant-admins/create', {
    method: 'POST',
    body: data,
  });
}

/** 部分更新（§1.5）—— 空 = 不修改。表单 load-then-merge 全量提交。 */
export interface UpdateTenantAdminInput {
  name?: string;
  country_code?: string;
  phone?: string;
  email?: string;
  max_login_failures?: number;
  login_fail_window?: number;
  login_fail_window_unit?: LockWindowUnit;
  is_locked?: boolean;
}

export function update_tenant_admin(
  tenant_admin_code: string,
  data: UpdateTenantAdminInput,
): Promise<void> {
  return request<void>('/tenantmanager/v1/tenant-admins/update', {
    method: 'PUT',
    body: { tenant_admin_code, ...data },
  });
}

export function delete_tenant_admin(tenant_admin_code: string): Promise<void> {
  return request<void>('/tenantmanager/v1/tenant-admins/delete', {
    method: 'DELETE',
    body: { tenant_admin_code },
  });
}

export function update_tenant_admin_status(
  tenant_admin_code: string,
  status: 'enable' | 'disable',
): Promise<void> {
  return request<void>('/tenantmanager/v1/tenant-admins/status', {
    method: 'PUT',
    body: { tenant_admin_code, status },
  });
}

/** 设置绑定的角色 —— 全量覆盖（非增量）。 */
export function set_tenant_admin_roles(
  tenant_admin_code: string,
  role_codes: string[],
): Promise<void> {
  return request<void>('/tenantmanager/v1/tenant-admins/roles', {
    method: 'PUT',
    body: { tenant_admin_code, role_codes },
  });
}

/** 重置密码 —— 系统生成，仅返回一次；服务端必然置位 must_change_password（请求不带该入参）。 */
export function reset_tenant_admin_password(
  tenant_admin_code: string,
): Promise<{ new_password: string }> {
  return request<{ new_password: string }>('/tenantmanager/v1/tenant-admins/reset-password', {
    method: 'PUT',
    body: { tenant_admin_code },
  });
}
