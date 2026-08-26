import type { Dict } from './types';

export const en_us: Dict = {
  'app.name': 'Tenant Console',

  /* Side navigation */
  'nav.overview': 'Overview',
  'nav.directory': 'Directory',
  'nav.organization': 'Organization',
  'nav.member': 'Members',
  'nav.security_group': 'Security Groups',
  'nav.tenant': 'Company Profile',
  'contacts.group': 'Contacts',
  'security.group': 'Access Control',
  'company.group': 'Company',

  /* Top bar */
  'topbar.tenant_switcher': 'Switch company',
  'topbar.directory_switcher': 'Switch directory',
  'topbar.language': 'Language',
  'topbar.change_password': 'Change password',
  'topbar.logout': 'Sign out',

  /* Auth */
  'auth.login_title': 'Sign in to Tenant Console',
  'auth.account': 'Account',
  'auth.account_required': 'Please enter your account',
  'auth.account_placeholder': 'Enter your account',
  'auth.password': 'Password',
  'auth.password_required': 'Please enter your password',
  'auth.password_placeholder': 'Enter your password',
  'auth.login': 'Sign in',
  'auth.error_unknown': 'Sign-in failed, please try again',
  'auth.domain': 'Domain ID',
  'auth.domain_required': 'Enter the 7-digit tenant domain',
  'auth.domain_placeholder': 'Enter your tenant domain',
  'auth.change_password_title': 'Change password',
  'auth.old_password': 'Current password',
  'auth.new_password': 'New password',
  'auth.confirm_password': 'Confirm new password',
  'auth.confirm_mismatch': 'Passwords do not match',
  'auth.password_updated': 'Password updated',

  /* Directory */
  'directory.create': 'New directory',
  'directory.edit': 'Edit directory',
  'directory.name': 'Name',
  'directory.name_required': 'Please enter a name',
  'directory.domain': 'Domain',
  'directory.domain_required': 'Enter a 7-digit domain code',
  'directory.domain_hint': '7-digit unique code, cannot change after creation',
  'directory.description': 'Description',
  'directory.created_at': 'Created at',
  'directory.delete_confirm':
    'Delete this directory? Its organizations and members will be removed too',

  /* Organization */
  'organization.title': 'Organization',
  'organization.create_root': 'New top-level department',
  'organization.create_child': 'New sub-department',
  'organization.edit': 'Edit department',
  'organization.parent': 'Parent',
  'organization.delete_confirm': 'Delete this department? Its children will be removed too',
  'organization.no_selection': 'Select a department on the left to view details',
  'organization.member_count': 'Direct members',

  /* Members */
  'member.title': 'Members',
  'member.create': 'Add member',
  'member.edit': 'Edit member',
  'member.detail': 'Member details',
  'member.display_name': 'Name',
  'member.display_name_required': 'Please enter a name',
  'member.username': 'Username',
  'member.username_required': 'Please enter a username',
  'member.phone': 'Phone',
  'member.email': 'Email',
  'member.email_invalid': 'Invalid email format',
  'member.status': 'Status',
  'member.primary_org': 'Department',
  'member.search': 'Search members',
  'member.delete_confirm': 'Delete this member?',

  /* Security groups */
  'security_group.create': 'New security group',
  'security_group.edit': 'Edit security group',
  'security_group.name': 'Name',
  'security_group.name_required': 'Please enter a name',
  'security_group.code': 'Code',
  'security_group.description': 'Description',
  'security_group.delete_confirm': 'Delete this security group?',

  /* Company profile */
  'tenant.company_profile': 'Company Profile',
  'tenant.name': 'Company name',
  'tenant.code': 'Company code',
  'tenant.domain': 'Domain',
  'tenant.contact_name': 'Contact',
  'tenant.contact_phone': 'Phone',
  'tenant.contact_email': 'Email',
  'tenant.status': 'Status',
  'tenant.remark': 'Remark',
  'tenant.created_at': 'Created at',

  /* Common actions */
  'common.placeholder': 'No data',
  'common.retry': 'Retry',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.actions': 'Actions',
  'common.saved': 'Saved',
  'common.deleted': 'Deleted',
  'feature.coming_soon': 'Coming soon',

  /* Overview */
  'overview.welcome': 'Welcome to the Tenant Console',
  'overview.welcome_subtitle': 'Manage company contacts, organization and member access',
  'overview.stat_tenants': 'Companies',
  'overview.stat_members': 'Members',
  'overview.stat_departments': 'Departments',
  'overview.stat_directories': 'Directories',
};
