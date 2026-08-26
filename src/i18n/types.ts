/**
 * i18n 字典形状。键为 snake_case 点分 key。
 * zh_cn.ts / en_us.ts 必须实现全部键（TS 强制）。
 * t(key, vars) 支持 {placeholder} 插值。
 */
export interface Dict {
  'app.name': string;

  /* 侧边导航 */
  'nav.overview': string;
  'nav.directory': string;
  'nav.organization': string;
  'nav.member': string;
  'nav.security_group': string;
  'nav.tenant': string;
  'contacts.group': string;
  'security.group': string;
  'company.group': string;

  /* 顶栏 */
  'topbar.tenant_switcher': string;
  'topbar.directory_switcher': string;
  'topbar.language': string;
  'topbar.change_password': string;
  'topbar.logout': string;

  /* 认证 */
  'auth.login_title': string;
  'auth.account': string;
  'auth.account_required': string;
  'auth.account_placeholder': string;
  'auth.password': string;
  'auth.password_required': string;
  'auth.password_placeholder': string;
  'auth.login': string;
  'auth.error_unknown': string;
  'auth.select_tenant': string;
  'auth.select_tenant_hint': string;
  'auth.change_password_title': string;
  'auth.old_password': string;
  'auth.new_password': string;
  'auth.confirm_password': string;
  'auth.confirm_mismatch': string;
  'auth.password_updated': string;

  /* 通用 */
  'common.placeholder': string;
  'common.retry': string;
  'feature.coming_soon': string;

  /* 概览 */
  'overview.welcome': string;
  'overview.welcome_subtitle': string;
  'overview.stat_tenants': string;
  'overview.stat_members': string;
  'overview.stat_departments': string;
  'overview.stat_directories': string;
}
