import { request } from '@/api/client';
import type { CreateTenantInput, TenantInfo } from '@/types/tenantmanager';

/** 企业信息 —— tenantmanager 契约（camelCase 字段，见 types/tenantmanager.ts）。 */
export function get_tenant(tenant_id: string): Promise<TenantInfo> {
  return request<TenantInfo>('/tenantmanager/v1/tenant/get', { params: { id: tenant_id } });
}

export function create_tenant(data: CreateTenantInput): Promise<void> {
  return request<void>('/tenantmanager/v1/tenant/create', { method: 'POST', body: data });
}
