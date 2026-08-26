import type { HttpHandler } from 'msw';
import { auth_handlers } from '@/mocks/handlers/auth';
import { directory_handlers } from '@/mocks/handlers/directory';
import { organization_handlers } from '@/mocks/handlers/organization';
import { security_group_handlers } from '@/mocks/handlers/security_group';
import { tenant_handlers } from '@/mocks/handlers/tenant';
import { user_handlers } from '@/mocks/handlers/user';

// 后端缺失接口的 MSW handlers，按 docs/auth-contract.md + docs/backend-gap-list.md 实现。
// dev:mock 全量模式（VITE_MOCK_SCOPE=all）注册全部；dev 真实后端模式（auth）只注册认证。
// handlers 不影响生产构建。
export const handlers: HttpHandler[] = [
  ...auth_handlers,
  ...directory_handlers,
  ...organization_handlers,
  ...user_handlers,
  ...security_group_handlers,
  ...tenant_handlers,
];
