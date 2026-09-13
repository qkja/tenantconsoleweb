import { request } from '@/api/client';
import type { TenantAdminInfo, TenantInfo } from '@/types/tenantmanager';

/**
 * 租户自助 + 管理员自助 —— tenantmanager 域（前缀 `/tenantmanager/v1`）。
 * 均为 TenantAdminScope；tenant_code / 管理员身份由网关注入，客户端不传。
 */

/** 当前租户资料（GetCurrentTenant）—— 复用 TenantInfo，但 status 留空（D29）。 */
export function get_current_tenant(): Promise<TenantInfo> {
  return request<TenantInfo>('/tenantmanager/v1/me');
}

/** 部分更新字段为空 = 不修改（§1.5）。不含 status（租户启停属平台作用域）。 */
export interface UpdateCurrentTenantInput {
  customer_name?: string;
  country_code?: string;
  phone?: string;
  email?: string;
  address?: string;
  contact_name?: string;
  language?: string;
}

export function update_current_tenant(data: UpdateCurrentTenantInput): Promise<void> {
  return request<void>('/tenantmanager/v1/me', { method: 'PUT', body: data });
}

/** 当前管理员（GetCurrentTenantAdmin）—— 登录账号即 `name`。 */
export function get_current_admin(): Promise<TenantAdminInfo> {
  return request<TenantAdminInfo>('/tenantmanager/v1/me/admin');
}

/** 仅可改 `name`（兼登录账号，改名即换凭证，下次登录须用新名称；不吊销当前会话 D26）。 */
export function update_current_admin(data: { name?: string }): Promise<void> {
  return request<void>('/tenantmanager/v1/me/admin', { method: 'PUT', body: data });
}
