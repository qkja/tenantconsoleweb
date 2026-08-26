import { request } from '@/api/client';
import type { CreateTenantInput, TenantInfo } from '@/types/tenantmanager';

/**
 * 企业信息 —— tenantmanager 契约（camelCase 字段，见 types/tenantmanager.ts）。
 * 租户以 domain（7 位数字唯一标识）寻址，非 id。
 */
export function get_tenant(domain: string): Promise<TenantInfo> {
  return request<TenantInfo>('/tenantmanager/v1/tenant/get', { params: { domain } });
}

export function create_tenant(data: CreateTenantInput): Promise<void> {
  return request<void>('/tenantmanager/v1/tenant/create', { method: 'POST', body: data });
}
