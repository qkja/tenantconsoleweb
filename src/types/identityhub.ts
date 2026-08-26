/**
 * identityhub 域类型 —— 全部 snake_case（protojson UseProtoNames 输出）。
 * 与 tenantmanager.ts（camelCase）物理隔离，勿混用。
 * 形状对照 openplatformsvr/internal/types/types.go。
 */

export interface DirectoryInfo {
  id: string;
  tenant_id: string;
  name: string;
  /** 7 位数字唯一码，租户内唯一，创建后不可改。 */
  domain: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface DirectoryListData {
  total: number;
  list: DirectoryInfo[];
}

export interface OrganizationInfo {
  id: string;
  tenant_id: string;
  domain: string;
  parent_id: string;
  name: string;
  description: string;
  org_type: string;
  external_id: string;
  level: number;
  /** 物化路径（祖先 id 链）。 */
  path: string[];
  created_at: string;
  updated_at: string;
}

export interface OrganizationListData {
  list: OrganizationInfo[];
  total: number;
  page: number;
  page_size: number;
}

export interface SecurityGroupInfo {
  id: string;
  tenant_id: string;
  domain: string;
  name: string;
  code: string;
  description: string;
  external_id: string;
  created_at: string;
  updated_at: string;
}

export interface UserInfo {
  id: string;
  tenant_id: string;
  domain: string;
  username: string;
  phone: string;
  email: string;
  display_name: string;
  avatar: string;
  external_id: string;
  primary_org_id: string;
  /** enable / disable。 */
  status: string;
  created_at: string;
  updated_at: string;
}

/** 用户分页结构（ListUser/SearchUser）—— {list, total, page, page_size}，注意与 Directory {total, list} 不同。 */
export interface UserListData {
  list: UserInfo[];
  total: number;
  page: number;
  page_size: number;
}
