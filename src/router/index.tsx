import { createBrowserRouter, Navigate } from 'react-router-dom';
import { FeaturePlaceholder } from '@/components/feature_placeholder';
import { ChangePassword } from '@/features/auth/change_password';
import { LoginPage } from '@/features/auth/login_page';
import { OverviewPage } from '@/features/overview/overview_page';
import { ConsoleLayout } from '@/layouts/console_layout';
import { RedirectIfAuthenticated, RequireAuth } from '@/router/guards';

/**
 * 路由表。阶段 3 起：/login 公开，控制台整体包 RequireAuth 守卫。
 * 阶段 4-6 将各 FeaturePlaceholder 替换为真实页面。
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
      { path: 'directory', element: <FeaturePlaceholder feature_key="nav.directory" /> },
      { path: 'organization', element: <FeaturePlaceholder feature_key="nav.organization" /> },
      { path: 'member', element: <FeaturePlaceholder feature_key="nav.member" /> },
      { path: 'security-group', element: <FeaturePlaceholder feature_key="nav.security_group" /> },
      { path: 'tenant', element: <FeaturePlaceholder feature_key="nav.tenant" /> },
      { path: 'change-password', element: <ChangePassword /> },
    ],
  },
]);
