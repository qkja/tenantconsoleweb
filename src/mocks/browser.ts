import { setupWorker } from 'msw/browser';
import type { HttpHandler } from 'msw';
import { auth_handlers } from './handlers/auth';
import { handlers } from './handlers';

export type MockScope = 'all' | 'auth';

function get_handlers(scope: MockScope): HttpHandler[] {
  // auth —— dev 真实后端模式：仅认证（authnexussvr 未落地）走 MSW，其余走网关。
  // all  —— dev:mock 全量模式：所有后端缺失接口均走 MSW。
  return scope === 'auth' ? auth_handlers : handlers;
}

/** 按 Mock 作用域创建 MSW worker（main.tsx 渲染前动态 import 启动）。 */
export function get_worker(scope: MockScope) {
  return setupWorker(...get_handlers(scope));
}
