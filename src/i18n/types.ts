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

  /* 目录域 */
  'directory.create': string;
  'directory.edit': string;
  'directory.name': string;
  'directory.name_required': string;
  'directory.domain': string;
  'directory.domain_required': string;
  'directory.domain_hint': string;
  'directory.description': string;
  'directory.created_at': string;
  'directory.delete_confirm': string;

  /* 组织架构 */
  'organization.title': string;
  'organization.create_root': string;
  'organization.create_child': string;
  'organization.edit': string;
  'organization.parent': string;
  'organization.delete_confirm': string;
  'organization.no_selection': string;
  'organization.member_count': string;

  /* 成员 */
  'member.title': string;
  'member.create': string;
  'member.edit': string;
  'member.detail': string;
  'member.display_name': string;
  'member.display_name_required': string;
  'member.username': string;
  'member.username_required': string;
  'member.phone': string;
  'member.email': string;
  'member.email_invalid': string;
  'member.status': string;
  'member.primary_org': string;
  'member.delete_confirm': string;

  /* 通用动作 */
  'common.placeholder': string;
  'common.retry': string;
  'common.save': string;
  'common.cancel': string;
  'common.delete': string;
  'common.actions': string;
  'common.saved': string;
  'common.deleted': string;
  'feature.coming_soon': string;

  /* 概览 */
  'overview.welcome': string;
  'overview.welcome_subtitle': string;
  'overview.stat_tenants': string;
  'overview.stat_members': string;
  'overview.stat_departments': string;
  'overview.stat_directories': string;
}
