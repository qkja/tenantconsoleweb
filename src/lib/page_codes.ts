import type { Dict } from '@/i18n/types';

/**
 * 前端页面清单 —— 租户管理角色 `page_codes` 的权威来源。
 * 权限点即前端页面清单：后端不枚举（contract §5.3 / 未决项 1），
 * 页面字典产出前由本常量承载「scope = tenant」的页面码。
 * 内置超级管理员 `page_codes = ["*"]`（通配全部）。
 */

export interface TenantPageCode {
  code: string;
  label_key: keyof Dict;
}

export const TENANT_PAGE_CODES: TenantPageCode[] = [
  { code: 'tenant.overview', label_key: 'nav.overview' },
  { code: 'tenant.directory', label_key: 'nav.directory' },
  { code: 'tenant.organization', label_key: 'nav.organization' },
  { code: 'tenant.member', label_key: 'nav.member' },
  { code: 'tenant.user_role', label_key: 'nav.user_role' },
  { code: 'tenant.company', label_key: 'nav.tenant' },
  { code: 'tenant.tenant_role', label_key: 'nav.tenant_role' },
  { code: 'tenant.tenant_admin', label_key: 'nav.tenant_admin' },
  { code: 'tenant.sync', label_key: 'nav.sync' },
];

const PAGE_CODE_LABEL_MAP = new Map<string, keyof Dict>(
  TENANT_PAGE_CODES.map((item) => [item.code, item.label_key]),
);

/** 页面码 → 展示名 i18n key；未收录（如通配 `*`）返回 null。 */
export function tenant_page_label_key(code: string): keyof Dict | null {
  return PAGE_CODE_LABEL_MAP.get(code) ?? null;
}
