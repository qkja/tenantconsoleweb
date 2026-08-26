import type { HttpHandler } from 'msw';
import { auth_handlers } from '@/mocks/handlers/auth';
import { security_group_handlers } from '@/mocks/handlers/security_group';
import { tenant_handlers } from '@/mocks/handlers/tenant';
import { user_handlers } from '@/mocks/handlers/user';

// 后端缺失接口的 MSW handlers，按 docs/auth-contract.md + docs/backend-gap-list.md 实现。
// 切真实后端：关 mock（VITE_USE_MOCKS）即可，handlers 不影响生产构建。
export const handlers: HttpHandler[] = [
  ...auth_handlers,
  ...user_handlers,
  ...security_group_handlers,
  ...tenant_handlers,
];
