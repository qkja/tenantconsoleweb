import type { TenantAdminInfo, TenantInfo } from '@/types/tenantmanager';

/** MSW 企业信息夹具 —— GetCurrentTenant（status 留空不返回）。 */
export const mock_current_tenant: TenantInfo = {
  tenant_code: 'tnt_01HX8ZK3M9QF2V7N4B6TCD1RWP',
  customer_name: '示例科技有限公司',
  status: 'enable',
  country_code: '+86',
  phone: '13800001000',
  email: 'contact@example.com',
  address: '北京市海淀区中关村大街 1 号',
  contact_name: '张伟',
  language: 'zh-CN',
  created_at: 1757721600,
  updated_at: 1757721600,
};

/** 当前管理员（GetCurrentTenantAdmin）—— 登录账号即 `name`。 */
export const mock_current_admin: TenantAdminInfo = {
  tenant_admin_code: 'tnu_01HX8ZK4P1QA2W9E5R7TYC3MBN',
  name: 'admin',
  email: 'admin@example.com',
  country_code: '+86',
  phone: '13800001001',
  status: 'enable',
  max_login_failures: 5,
  login_fail_window: 15,
  login_fail_window_unit: 'minute',
  failed_login_count: 0,
  is_locked: false,
  must_change_password: false,
  role_codes: ['tro_01HX8ZKAW8ZH9D6N2Y4AFK0TJV'],
  role_names: ['超级管理员'],
  is_initial: true,
  last_login_at: 1757808000,
  created_at: 1757721600,
  updated_at: 1757721600,
};
