import { createBrowserRouter, Navigate } from 'react-router-dom';
import { FeaturePlaceholder } from '@/components/feature_placeholder';
import { OverviewPage } from '@/features/overview/overview_page';
import { ConsoleLayout } from '@/layouts/console_layout';

/**
 * 路由表。阶段 3 接入 /login 与鉴权守卫（router/guards.tsx）；
 * 阶段 4-6 将各 FeaturePlaceholder 替换为真实页面。
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <ConsoleLayout />,
    children: [
      { index: true, element: <Navigate to="/overview" replace /> },
      { path: 'overview', element: <OverviewPage /> },
      { path: 'directory', element: <FeaturePlaceholder feature_key="nav.directory" /> },
      { path: 'organization', element: <FeaturePlaceholder feature_key="nav.organization" /> },
      { path: 'member', element: <FeaturePlaceholder feature_key="nav.member" /> },
      { path: 'security-group', element: <FeaturePlaceholder feature_key="nav.security_group" /> },
      { path: 'tenant', element: <FeaturePlaceholder feature_key="nav.tenant" /> },
    ],
  },
]);
