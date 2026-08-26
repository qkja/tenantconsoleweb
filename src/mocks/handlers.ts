import type { HttpHandler } from 'msw';
import { auth_handlers } from '@/mocks/handlers/auth';

// 后端缺失接口的 MSW handlers，按 docs/auth-contract.md 实现。
// 切真实后端：关 mock（VITE_USE_MOCKS）即可，handlers 不影响生产构建。
export const handlers: HttpHandler[] = [...auth_handlers];
