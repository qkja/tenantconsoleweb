/* eslint-disable @typescript-eslint/naming-convention --
   tenantmanager 契约强制 camelCase：protojson 大小写敏感，
   字段名写错会静默丢字段（tenant.api:5 显式警告）。
   本文件豁免项目 snake_case 命名规则，勿复制此豁免到其他文件。 */

export interface TenantInfo {
  id: string;
  name: string;
  domain: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  /** trial / paid / suspended / deleted（生命周期状态机）。 */
  status: string;
  remark: string;
  createTime: string;
  updateTime: string;
  /** 租户管理员（账号元数据，密码凭证在认证服务）。 */
  admins?: TenantAdminInfo[];
}

export interface TenantAdminInfo {
  account: string;
  displayName: string;
  status: string;
}

export interface CreateTenantInput {
  name: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

/** 添加管理员请求体（契约 camelCase：displayName 在契约文件定义以豁免命名规则）。 */
export interface AddAdminParams {
  account: string;
  displayName: string;
  password: string;
}
