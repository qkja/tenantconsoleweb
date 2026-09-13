/* eslint-disable react-refresh/only-export-components --
   路由配置模块：导出 lazy 组件 + router，非组件模块，fast-refresh 无意义 */
import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/auth/login_page';
import { ConsoleLayout } from '@/layouts/console_layout';
import { RedirectIfAuthenticated, RequireAuth } from '@/router/guards';

// 业务页懒加载（route-based code splitting）：主 chunk 只含外壳与登录，
// 各功能页（含重型的 ProTable/ProForm）按需加载。
const OverviewPage = lazy(() =>
  import('@/features/overview/overview_page').then((m) => ({ default: m.OverviewPage })),
);
const DirectoryPage = lazy(() =>
  import('@/features/directory/directory_page').then((m) => ({ default: m.DirectoryPage })),
);
const OrganizationPage = lazy(() =>
  import('@/features/organization/organization_page').then((m) => ({
    default: m.OrganizationPage,
  })),
);
const MemberPage = lazy(() =>
  import('@/features/member/member_page').then((m) => ({ default: m.MemberPage })),
);
const UserRolePage = lazy(() =>
  import('@/features/user_role/user_role_page').then((m) => ({ default: m.UserRolePage })),
);
const TenantPage = lazy(() =>
  import('@/features/tenant/tenant_page').then((m) => ({ default: m.TenantPage })),
);
const AdminProfile = lazy(() =>
  import('@/features/auth/admin_profile').then((m) => ({ default: m.AdminProfile })),
);
const ChangePassword = lazy(() =>
  import('@/features/auth/change_password').then((m) => ({ default: m.ChangePassword })),
);

/**
 * 路由表。/login 公开，控制台整体包 RequireAuth 守卫。
 * 全部业务页已接入：概览/目录域/组织架构/成员/用户角色/企业信息/我的账号/改密。
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
      { path: 'user-role', element: <UserRolePage /> },
      { path: 'tenant', element: <TenantPage /> },
      { path: 'admin-profile', element: <AdminProfile /> },
      { path: 'change-password', element: <ChangePassword /> },
    ],
  },
]);
