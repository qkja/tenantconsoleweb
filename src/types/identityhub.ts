/**
 * identityhub 域类型 —— 按定稿契约 `drafts/openplatformsvr/api/identityhub/v1/**`（全 snake_case）。
 * 定位键一律 `*_code`（`dir_` / `org_` / `usr_` / `uro_` + 26 位 ULID）。
 */

export type DirectoryType = 'local' | 'ad' | 'ldap';
export type UserSource = 'local' | 'ad' | 'ldap';
export type EntityStatus = 'enable' | 'disable';
export type LockWindowUnit = 'second' | 'minute' | 'hour' | 'day';

export interface DirectoryInfo {
  directory_code: string;
  name: string;
  /** local / ad / ldap（创建后不可变）。 */
  type: DirectoryType;
  description: string;
  status: EntityStatus;
  /** local 恒为 false。 */
  sync_configured: boolean;
  created_at: number;
  updated_at: number;
}

export interface OrganizationInfo {
  organization_code: string;
  directory_code: string;
  /** 父组织 code；根节点为空。 */
  parent_code: string;
  name: string;
  description: string;
  org_type: string;
  external_id: string;
  level: number;
  /** 物化路径 string（含自身、首尾 `/`）。 */
  path: string;
  created_at: number;
  updated_at: number;
}

export interface UserInfo {
  user_code: string;
  directory_code: string;
  organization_code: string;
  /** 登录账号 / 显示名，目录域内唯一。 */
  name: string;
  email: string;
  country_code: string;
  phone: string;
  description: string;
  /** 来源：local / ad / ldap。 */
  source: UserSource;
  external_id: string;
  status: EntityStatus;
  max_login_failures: number;
  login_fail_window: number;
  login_fail_window_unit: LockWindowUnit;
  failed_login_count: number;
  is_locked: boolean;
  must_change_password: boolean;
  user_role_codes: string[];
  created_at: number;
  updated_at: number;
}

export interface UserRoleInfo {
  user_role_code: string;
  directory_code: string;
  name: string;
  description: string;
  status: EntityStatus;
  created_at: number;
  updated_at: number;
}

export interface UserRoleMemberInfo {
  user_code: string;
  name: string;
}
