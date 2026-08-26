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
  'auth.select_tenant': 'Choose a company',
  'auth.select_tenant_hint': 'This account can access the companies below',
  'auth.change_password_title': 'Change password',
  'auth.old_password': 'Current password',
  'auth.new_password': 'New password',
  'auth.confirm_password': 'Confirm new password',
  'auth.confirm_mismatch': 'Passwords do not match',
  'auth.password_updated': 'Password updated',

  /* Common */
  'common.placeholder': 'No data',
  'common.retry': 'Retry',
  'feature.coming_soon': 'Coming soon',

  /* Overview */
  'overview.welcome': 'Welcome to the Tenant Console',
  'overview.welcome_subtitle': 'Manage company contacts, organization and member access',
  'overview.stat_tenants': 'Companies',
  'overview.stat_members': 'Members',
  'overview.stat_departments': 'Departments',
  'overview.stat_directories': 'Directories',
};
