import type { SessionPayload } from '@/types/auth';

/** MSW 认证夹具 —— 登录账号 = 租户管理员名称（name）。 */
export interface MockTenantAdminAccount {
  name: string;
  password: string;
  tenant_code: string;
  must_change_password: boolean;
}

export const mock_tenant_admin_accounts: MockTenantAdminAccount[] = [
  {
    name: 'admin',
    password: 'admin123',
    tenant_code: 'tnt_01HX8ZK3M9QF2V7N4B6TCD1RWP',
    must_change_password: false,
  },
];

export function build_session(name: string): SessionPayload {
  const account = mock_tenant_admin_accounts.find((item) => item.name === name);
  return {
    access_token: `mock_jwt_${name}_${Date.now().toString(36)}`,
    refresh_token: `mock_refresh_${name}`,
    expires_in: 7200,
    token_type: 'Bearer',
    tenant_code: account?.tenant_code ?? '',
    must_change_password: account?.must_change_password ?? false,
  };
}
