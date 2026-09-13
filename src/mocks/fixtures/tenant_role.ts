import type { TenantRoleInfo } from '@/types/tenantmanager';

/** MSW 租户管理角色夹具 —— 一个内置超级管理员 + 一个自定义角色。 */
export const mock_tenant_roles: TenantRoleInfo[] = [
  {
    tenant_role_code: 'tro_01HX8ZKAW8ZH9D6N2Y4AFK0TJV',
    name: '超级管理员',
    description: '建租户时自动创建的内置角色',
    status: 'enable',
    built_in: true,
    page_codes: ['*'],
    scope_organization_codes: [],
    scope_directory_codes: [],
    created_at: 1757721600,
    updated_at: 1757721600,
  },
  {
    tenant_role_code: 'tro_01HX8ZKDZ1CM2G9R5B7DKN3WMY',
    name: '运营专员',
    description: '负责日常运营与用户维护',
    status: 'enable',
    built_in: false,
    page_codes: ['tenant.member', 'tenant.organization'],
    scope_organization_codes: ['org_01HX8ZK6R3SC4Y1G7T9VAE5NDR'],
    scope_directory_codes: [],
    created_at: 1757721600,
    updated_at: 1757721600,
  },
];
