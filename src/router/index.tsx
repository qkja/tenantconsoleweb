import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ChangePassword } from '@/features/auth/change_password';
import { LoginPage } from '@/features/auth/login_page';
import { DirectoryPage } from '@/features/directory/directory_page';
import { MemberPage } from '@/features/member/member_page';
import { OrganizationPage } from '@/features/organization/organization_page';
import { SecurityGroupPage } from '@/features/security_group/security_group_page';
import { TenantPage } from '@/features/tenant/tenant_page';
import { OverviewPage } from '@/features/overview/overview_page';
import { ConsoleLayout } from '@/layouts/console_layout';
import { RedirectIfAuthenticated, RequireAuth } from '@/router/guards';

/**
 * 路由表。/login 公开，控制台整体包 RequireAuth 守卫。
 * 全部业务页已接入：概览/目录域/组织架构/成员/安全组/企业信息/改密。
 */
export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <RedirectIfAuthenticated>
        <LoginPage />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <ConsoleLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/overview" replace /> },
      { path: 'overview', element: <OverviewPage /> },
      { path: 'directory', element: <DirectoryPage /> },
      { path: 'organization', element: <OrganizationPage /> },
      { path: 'member', element: <MemberPage /> },
      { path: 'security-group', element: <SecurityGroupPage /> },
      { path: 'tenant', element: <TenantPage /> },
      { path: 'change-password', element: <ChangePassword /> },
    ],
  },
]);
