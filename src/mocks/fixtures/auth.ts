import type { SessionTenant, SessionUser } from '@/types/auth';

/** MSW 认证夹具 —— 契约实现，非真实数据。登录账号 = 租户 domain。 */

export const mock_tenants: SessionTenant[] = [
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

/** 租户认证（管理员）：domain 即账号。 */
export interface MockTenantAccount {
  domain: string;
  password: string;
  user: SessionUser;
}

export const mock_tenant_accounts: MockTenantAccount[] = [
  {
    domain: '1000001',
    password: 'admin123',
    user: {
      user_id: 'u_001',
      username: 'admin',
      display_name: '系统管理员',
      scope: 'admin',
      roles: ['tenant_admin'],
    },
  },
  {
    domain: '1000002',
    password: 'admin123',
    user: {
      user_id: 'u_003',
      username: 'admin',
      display_name: 'Acme Admin',
      scope: 'admin',
      roles: ['tenant_admin'],
    },
  },
];

/** 用户认证（成员）：domain + account + password。 */
export interface MockUserAccount {
  domain: string;
  account: string;
  password: string;
  user: SessionUser;
}

export const mock_user_accounts: MockUserAccount[] = [
  {
    domain: '1000001',
    account: 'zhangwei',
    password: 'member123',
    user: {
      user_id: 'u_002',
      username: 'zhangwei',
      display_name: '张伟',
      scope: 'member',
      roles: ['member'],
    },
  },
];

export function tenant_of(domain: string): SessionTenant | undefined {
  return mock_tenants.find((tenant) => tenant.domain === domain);
}
