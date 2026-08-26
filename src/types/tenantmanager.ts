/* eslint-disable @typescript-eslint/naming-convention --
   tenantmanager 契约强制 camelCase：protojson 大小写敏感，
   字段名写错会静默丢字段（tenant.api:5 显式警告）。
   本文件豁免项目 snake_case 命名规则，勿复制此豁免到其他文件。 */

export interface TenantInfo {
  id: string;
  name: string;
  code: string;
  domain: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  /** paid / trial / internal。 */
  status: string;
  remark: string;
  createTime: string;
  updateTime: string;
}

export interface CreateTenantInput {
  name: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}
