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

/* ---- 同步（identityhub/v1/sync）—— 仅 ad / ldap 目录域有同步配置，单向不回写 ---- */

export type SyncProvider = 'ad' | 'ldap';
export type SyncTriggerType = 'manual' | 'scheduled';
export type SyncRecordStatus = 'success' | 'partial' | 'failed' | 'running';
export type SyncLastStatus = 'success' | 'partial' | 'failed';

/** 字段映射：外部源字段 → 本平台字段。 */
export interface SyncFieldMapping {
  external_field: string;
  local_field: string;
}

/** 同步配置 —— 绑定密码（bind_password）仅可写不可读，查询不回传。 */
export interface SyncConfigInfo {
  directory_code: string;
  provider: SyncProvider;
  server_url: string;
  base_dn: string;
  bind_dn: string;
  /** 匹配键：作为 external_id 的外部字段名（须为不可变字段）。 */
  external_id_field: string;
  field_mappings: SyncFieldMapping[];
  /** 同步周期（分钟）；0 = 只手工触发。 */
  sync_interval_minutes: number;
  enabled: boolean;
  scope_organization: boolean;
  scope_user: boolean;
  scope_user_role: boolean;
  last_sync_at: number;
  last_sync_status: string;
  created_at: number;
  updated_at: number;
}

/** 同步记录（append-only，定位键 syn + 26 位 ULID）。 */
export interface SyncRecordInfo {
  sync_record_code: string;
  directory_code: string;
  trigger_type: SyncTriggerType;
  status: SyncRecordStatus;
  started_at: number;
  finished_at: number;
  total_count: number;
  success_count: number;
  failed_count: number;
}

/** 同步失败明细 —— 字段对齐独立集合 sync_failures（一条失败一行）。 */
export interface SyncRecordFailureInfo {
  sync_failure_code: string;
  user_code: string;
  external_id: string;
  reason: string;
  created_at: number;
}
