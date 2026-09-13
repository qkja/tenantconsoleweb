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
  'nav.user_role': string;
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
  'topbar.my_account': string;

  /* 认证 */
  'auth.login_title': string;
  'auth.name': string;
  'auth.name_required': string;
  'auth.name_placeholder': string;
  'auth.password': string;
  'auth.password_required': string;
  'auth.password_placeholder': string;
  'auth.login': string;
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
  'directory.type': string;
  'directory.type_required': string;
  'directory.type_immutable': string;
  'directory.description': string;
  'directory.status': string;
  'directory.code': string;
  'directory.created_at': string;
  'directory.delete_confirm': string;

  /* 组织架构 */
  'organization.title': string;
  'organization.create_root': string;
  'organization.create_child': string;
  'organization.edit': string;
  'organization.parent': string;
  'organization.path': string;
  'organization.level': string;
  'organization.delete_confirm': string;
  'organization.no_selection': string;

  /* 成员 */
  'member.title': string;
  'member.create': string;
  'member.edit': string;
  'member.detail': string;
  'member.name': string;
  'member.name_required': string;
  'member.country_code': string;
  'member.phone': string;
  'member.email': string;
  'member.description': string;
  'member.organization': string;
  'member.password': string;
  'member.password_required': string;
  'member.source': string;
  'member.external_id': string;
  'member.external_hint': string;
  'member.status': string;
  'member.search': string;
  'member.delete_confirm': string;
  'member.disable_confirm': string;
  'member.enable_confirm': string;

  /* 用户角色 */
  'user_role.create': string;
  'user_role.edit': string;
  'user_role.name': string;
  'user_role.name_required': string;
  'user_role.code': string;
  'user_role.description': string;
  'user_role.delete_confirm': string;
  'user_role.members': string;
  'user_role.select_members': string;
  'user_role.add_members': string;
  'user_role.remove': string;
  'user_role.remove_confirm': string;

  /* 企业信息 */
  'tenant.company_profile': string;
  'tenant.edit': string;
  'tenant.customer_name': string;
  'tenant.customer_name_required': string;
  'tenant.contact_name': string;
  'tenant.phone': string;
  'tenant.email': string;
  'tenant.address': string;
  'tenant.language': string;
  'tenant.created_at': string;

  /* 我的账号 */
  'account.title': string;
  'account.rename': string;
  'account.name': string;
  'account.name_required': string;
  'account.email': string;
  'account.phone': string;
  'account.roles': string;
  'account.status': string;
  'account.saved': string;
  'account.rename_warning': string;

  /* 通用动作 */
  'common.placeholder': string;
  'common.retry': string;
  'common.save': string;
  'common.cancel': string;
  'common.delete': string;
  'common.actions': string;
  'common.saved': string;
  'common.deleted': string;
  'common.disable': string;
  'common.enable': string;
  'common.email_invalid': string;
  'feature.coming_soon': string;

  /* 概览 */
  'overview.welcome': string;
  'overview.welcome_subtitle': string;
  'overview.stat_tenants': string;
  'overview.stat_members': string;
  'overview.stat_departments': string;
  'overview.stat_directories': string;
}
