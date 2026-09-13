import { request } from '@/api/client';
import type { PageData } from '@/api/envelope';
import type { TenantRoleInfo } from '@/types/tenantmanager';

/**
 * 租户管理角色（`tro`）—— 持有页面权限 + 数据范围，授予租户管理员。
 * 前缀 `/tenantmanager/v1/tenant-roles`。
 * 内置「超级管理员」（built_in = true）不可删、不可改、不可停用（后端硬拦）。
 */

export type TenantRoleListData = PageData & { list: TenantRoleInfo[] };

export interface ListTenantRolesParams {
  keyword?: string;
  page?: number;
  page_size?: number;
  search_fields?: string[];
  status?: string;
  sort_by?: string;
  descending?: string;
}

export function list_tenant_roles(params?: ListTenantRolesParams): Promise<TenantRoleListData> {
  return request<TenantRoleListData>('/tenantmanager/v1/tenant-roles/list', { params });
}

export function get_tenant_role(tenant_role_code: string): Promise<TenantRoleInfo> {
  return request<TenantRoleInfo>('/tenantmanager/v1/tenant-roles/get', {
    params: { tenant_role_code },
  });
}

export interface CreateTenantRoleInput {
  name: string;
  description?: string;
  page_codes?: string[];
  scope_organization_codes?: string[];
  scope_directory_codes?: string[];
}

export function create_tenant_role(
  data: CreateTenantRoleInput,
): Promise<{ tenant_role_code: string }> {
  return request<{ tenant_role_code: string }>('/tenantmanager/v1/tenant-roles/create', {
    method: 'POST',
    body: data,
  });
}

export interface UpdateTenantRoleInput {
  name?: string;
  description?: string;
  /** 传则整体覆盖页面权限；不传则保持。 */
  page_codes?: string[];
  scope_organization_codes?: string[];
  scope_directory_codes?: string[];
}

export function update_tenant_role(
  tenant_role_code: string,
  data: UpdateTenantRoleInput,
): Promise<void> {
  return request<void>('/tenantmanager/v1/tenant-roles/update', {
    method: 'PUT',
    body: { tenant_role_code, ...data },
  });
}

export function delete_tenant_role(tenant_role_code: string): Promise<void> {
  return request<void>('/tenantmanager/v1/tenant-roles/delete', {
    method: 'DELETE',
    body: { tenant_role_code },
  });
}

export function update_tenant_role_status(
  tenant_role_code: string,
  status: 'enable' | 'disable',
): Promise<void> {
  return request<void>('/tenantmanager/v1/tenant-roles/status', {
    method: 'PUT',
    body: { tenant_role_code, status },
  });
}
