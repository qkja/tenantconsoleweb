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
  'nav.tenant_role': string;
  'nav.tenant_admin': string;
  'nav.sync': string;
  'nav.sync_records': string;
  'contacts.group': string;
  'security.group': string;
  'company.group': string;
  'integration.group': string;

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

  /* 租户管理角色 */
  'tenant_role.create': string;
  'tenant_role.edit': string;
  'tenant_role.name': string;
  'tenant_role.name_required': string;
  'tenant_role.code': string;
  'tenant_role.description': string;
  'tenant_role.status': string;
  'tenant_role.built_in': string;
  'tenant_role.built_in_true': string;
  'tenant_role.built_in_false': string;
  'tenant_role.page_codes': string;
  'tenant_role.scope_organization': string;
  'tenant_role.scope_directory': string;
  'tenant_role.scope_required': string;
  'tenant_role.scope_descendants_hint': string;
  'tenant_role.delete_confirm': string;
  'tenant_role.disable_confirm': string;
  'tenant_role.enable_confirm': string;
  'tenant_role.built_in_protected': string;
  'tenant_role.created_at': string;

  /* 租户管理员 */
  'tenant_admin.create': string;
  'tenant_admin.edit': string;
  'tenant_admin.name': string;
  'tenant_admin.name_required': string;
  'tenant_admin.name_hint': string;
  'tenant_admin.code': string;
  'tenant_admin.email': string;
  'tenant_admin.phone': string;
  'tenant_admin.country_code': string;
  'tenant_admin.status': string;
  'tenant_admin.password': string;
  'tenant_admin.password_required': string;
  'tenant_admin.roles': string;
  'tenant_admin.bind_roles': string;
  'tenant_admin.bind_roles_hint': string;
  'tenant_admin.must_change_password': string;
  'tenant_admin.max_login_failures': string;
  'tenant_admin.login_fail_window': string;
  'tenant_admin.login_fail_window_unit': string;
  'tenant_admin.is_locked': string;
  'tenant_admin.locked': string;
  'tenant_admin.reset_password': string;
  'tenant_admin.reset_confirm': string;
  'tenant_admin.new_password': string;
  'tenant_admin.new_password_hint': string;
  'tenant_admin.is_initial': string;
  'tenant_admin.last_login_at': string;
  'tenant_admin.delete_confirm': string;
  'tenant_admin.disable_confirm': string;
  'tenant_admin.enable_confirm': string;
  'tenant_admin.created_at': string;

  /* 同步配置 */
  'sync.title': string;
  'sync.select_directory': string;
  'sync.no_directory_hint': string;
  'sync.provider': string;
  'sync.server_url': string;
  'sync.server_url_required': string;
  'sync.base_dn': string;
  'sync.bind_dn': string;
  'sync.bind_password': string;
  'sync.bind_password_hint': string;
  'sync.external_id_field': string;
  'sync.external_id_field_required': string;
  'sync.external_id_field_hint': string;
  'sync.field_mappings': string;
  'sync.external_field': string;
  'sync.local_field': string;
  'sync.add_mapping': string;
  'sync.sync_interval_minutes': string;
  'sync.sync_interval_hint': string;
  'sync.enabled': string;
  'sync.scope_organization': string;
  'sync.scope_user': string;
  'sync.scope_user_role': string;
  'sync.trigger': string;
  'sync.trigger_confirm': string;
  'sync.last_sync_at': string;
  'sync.last_sync_status': string;
  'sync.one_way_hint': string;

  /* 同步记录 */
  'sync_records.title': string;
  'sync_records.code': string;
  'sync_records.directory': string;
  'sync_records.trigger_type': string;
  'sync_records.trigger_manual': string;
  'sync_records.trigger_scheduled': string;
  'sync_records.status': string;
  'sync_records.started_at': string;
  'sync_records.finished_at': string;
  'sync_records.total_count': string;
  'sync_records.success_count': string;
  'sync_records.failed_count': string;
  'sync_records.view_failures': string;
  'sync_records.failures_title': string;
  'sync_records.failure_code': string;
  'sync_records.user_code': string;
  'sync_records.external_id': string;
  'sync_records.reason': string;
  'sync_records.created_at': string;

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
  'common.copy': string;
  'feature.coming_soon': string;

  /* 概览 */
  'overview.welcome': string;
  'overview.welcome_subtitle': string;
  'overview.stat_tenants': string;
  'overview.stat_members': string;
  'overview.stat_departments': string;
  'overview.stat_directories': string;
}
