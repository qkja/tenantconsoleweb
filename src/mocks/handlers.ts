import type { HttpHandler } from 'msw';
import { auth_handlers } from '@/mocks/handlers/auth';
import { directory_handlers } from '@/mocks/handlers/directory';
import { organization_handlers } from '@/mocks/handlers/organization';
import { sync_handlers } from '@/mocks/handlers/sync';
import { tenant_admin_handlers } from '@/mocks/handlers/tenant_admin';
import { tenant_handlers } from '@/mocks/handlers/tenant';
import { tenant_role_handlers } from '@/mocks/handlers/tenant_role';
import { user_handlers } from '@/mocks/handlers/user';
import { user_role_handlers } from '@/mocks/handlers/user_role';

// 后端缺失接口的 MSW handlers，按定稿契约实现。
// dev:mock 全量模式（VITE_MOCK_SCOPE=all）注册全部；dev 真实后端模式（auth）只注册认证。
// handlers 不影响生产构建。
export const handlers: HttpHandler[] = [
  ...auth_handlers,
  ...directory_handlers,
  ...organization_handlers,
  ...user_handlers,
  ...user_role_handlers,
  ...tenant_handlers,
  ...tenant_role_handlers,
  ...tenant_admin_handlers,
  ...sync_handlers,
];
