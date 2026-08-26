import type { Dict } from './types';

export const zh_cn: Dict = {
  'app.name': '租户控制台',

  /* 侧边导航 */
  'nav.overview': '概览',
  'nav.directory': '目录域',
  'nav.organization': '组织架构',
  'nav.member': '成员管理',
  'nav.security_group': '安全组',
  'nav.tenant': '企业信息',
  'contacts.group': '通讯录',
  'security.group': '权限管理',
  'company.group': '企业管理',

  /* 顶栏 */
  'topbar.tenant_switcher': '切换企业',
  'topbar.directory_switcher': '切换目录域',
  'topbar.language': '语言',
  'topbar.change_password': '修改密码',
  'topbar.logout': '退出登录',

  /* 认证 */
  'auth.login_title': '登录租户控制台',
  'auth.account': '账号',
  'auth.account_required': '请输入账号',
  'auth.account_placeholder': '请输入账号',
  'auth.password': '密码',
  'auth.password_required': '请输入密码',
  'auth.password_placeholder': '请输入密码',
  'auth.login': '登 录',
  'auth.error_unknown': '登录失败，请稍后重试',
  'auth.select_tenant': '选择企业',
  'auth.select_tenant_hint': '该账号可访问以下企业，请选择进入',
  'auth.change_password_title': '修改密码',
  'auth.old_password': '原密码',
  'auth.new_password': '新密码',
  'auth.confirm_password': '确认新密码',
  'auth.confirm_mismatch': '两次输入的密码不一致',
  'auth.password_updated': '密码修改成功',

  /* 目录域 */
  'directory.create': '新建目录域',
  'directory.edit': '编辑目录域',
  'directory.name': '名称',
  'directory.name_required': '请输入名称',
  'directory.domain': '域标识',
  'directory.domain_required': '请输入 7 位数字域标识',
  'directory.domain_hint': '7 位数字唯一码，创建后不可修改',
  'directory.description': '描述',
  'directory.created_at': '创建时间',
  'directory.delete_confirm': '确认删除该目录域？将连带删除其下组织与成员',

  /* 组织架构 */
  'organization.title': '组织架构',
  'organization.create_root': '新建顶级部门',
  'organization.create_child': '新建子部门',
  'organization.edit': '编辑部门',
  'organization.parent': '上级部门',
  'organization.delete_confirm': '确认删除该部门？将连带删除其子部门',
  'organization.no_selection': '请选择左侧部门查看详情',
  'organization.member_count': '直属成员',

  /* 通用动作 */
  'common.placeholder': '暂无数据',
  'common.retry': '重试',
  'common.save': '保存',
  'common.cancel': '取消',
  'common.delete': '删除',
  'common.actions': '操作',
  'common.saved': '已保存',
  'common.deleted': '已删除',
  'feature.coming_soon': '功能建设中',

  /* 概览 */
  'overview.welcome': '欢迎使用租户控制台',
  'overview.welcome_subtitle': '统一管理企业通讯录、组织架构与成员权限',
  'overview.stat_tenants': '可访问企业',
  'overview.stat_members': '成员总数',
  'overview.stat_departments': '部门总数',
  'overview.stat_directories': '目录域',
};
