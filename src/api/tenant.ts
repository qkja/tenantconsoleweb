import { request } from '@/api/client';
import type {
  AddAdminParams,
  CreateTenantInput,
  TenantAdminInfo,
  TenantInfo,
} from '@/types/tenantmanager';

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

// ---- 租户管理员管理（P3 §2.2） ----
// 网关租户作用域：domain 从 JWT claims 派生，客户端无需（也不应）传。

/** 当前租户管理员列表。 */
export function list_admins(): Promise<TenantAdminInfo[]> {
  return request<TenantAdminInfo[]>('/tenantmanager/v1/tenant/admins', { method: 'GET' });
}

/** 添加租户管理员（双写元数据 + 凭证；初始密码由添加者提供）。 */
export function add_admin(params: AddAdminParams): Promise<void> {
  return request<void>('/tenantmanager/v1/tenant/admins/add', {
    method: 'POST',
    body: params,
  });
}

/** 设置管理员状态（enable/disable；禁用吊销其会话）。 */
export function set_admin_status(params: {
  account: string;
  status: 'enable' | 'disable';
}): Promise<void> {
  return request<void>('/tenantmanager/v1/tenant/admins/status', {
    method: 'PUT',
    body: params,
  });
}
