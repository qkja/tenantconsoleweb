/**
 * tenantmanager 域类型 —— 按定稿契约 `drafts/openplatformsvr/api/tenantmanager/v1/**`（全 snake_case）。
 * 定位键一律 `*_code`（`tnt_` / `tnu_` / `tro_` + 26 位 ULID）。
 */

export type EntityStatus = 'enable' | 'disable';
export type LockWindowUnit = 'second' | 'minute' | 'hour' | 'day';

/** 租户资料 —— 不含登录账号字段（登录凭证 = `tenant_admins.name`），不含界面语言。 */
export interface TenantInfo {
  tenant_code: string;
  /** 客户名称（租户显示名）。 */
  customer_name: string;
  status: EntityStatus;
  country_code: string;
  phone: string;
  email: string;
  address: string;
  contact_name: string;
  /** 租户默认业务语言：zh-CN / en-US。 */
  language: string;
  created_at: number;
  updated_at: number;
}

/** 租户管理员 —— `name` 兼姓名与登录账号，可修改（改名即登录凭证变更）。 */
export interface TenantAdminInfo {
  tenant_admin_code: string;
  name: string;
  email: string;
  country_code: string;
  phone: string;
  status: EntityStatus;
  max_login_failures: number;
  login_fail_window: number;
  login_fail_window_unit: LockWindowUnit;
  failed_login_count: number;
  is_locked: boolean;
  must_change_password: boolean;
  role_codes: string[];
  role_names: string[];
  is_initial: boolean;
  last_login_at: number;
  created_at: number;
  updated_at: number;
}

/** 租户管理角色（tro）—— 持有页面权限 + 数据范围，授予租户管理员。 */
export interface TenantRoleInfo {
  tenant_role_code: string;
  name: string;
  description: string;
  status: EntityStatus;
  built_in: boolean;
  page_codes: string[];
  scope_organization_codes: string[];
  scope_directory_codes: string[];
  created_at: number;
  updated_at: number;
}
