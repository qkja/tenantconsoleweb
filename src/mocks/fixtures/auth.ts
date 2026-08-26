import type { SessionUser, TenantOption } from '@/types/auth';

/** MSW 认证夹具 —— 契约实现，非真实数据。 */

export const mock_tenants: TenantOption[] = [
  {
    tenant_id: 't_001',
    tenant_name: '示例科技有限公司',
    domain: '1000001',
    language: 'zh_CN',
    ui_language: 'zh_CN',
  },
  {
    tenant_id: 't_002',
    tenant_name: 'Acme Cloud Inc.',
    domain: '1000002',
    language: 'en_US',
    ui_language: 'en_US',
  },
];

export interface MockAccount {
  account: string;
  password: string;
  user: SessionUser;
  tenant_ids: string[];
}

/** admin 属两租户（触发多企业选择）；member 属单租户。 */
export const mock_accounts: MockAccount[] = [
  {
    account: 'admin',
    password: 'admin123',
    user: {
      user_id: 'u_001',
      username: 'admin',
      display_name: '系统管理员',
      scope: 'admin',
      roles: ['tenant_admin'],
    },
    tenant_ids: ['t_001', 't_002'],
  },
  {
    account: 'member',
    password: 'member123',
    user: {
      user_id: 'u_002',
      username: 'zhangwei',
      display_name: '张伟',
      scope: 'member',
      roles: ['member'],
    },
    tenant_ids: ['t_001'],
  },
];

export function tenants_of(tenant_ids: string[]): TenantOption[] {
  return tenant_ids
    .map((id) => mock_tenants.find((tenant) => tenant.tenant_id === id))
    .filter((tenant): tenant is TenantOption => tenant != null);
}
