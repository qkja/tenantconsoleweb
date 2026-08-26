import { http, HttpResponse } from 'msw';
import type { ApiEnvelope } from '@/api/envelope';
import type { LoginResult } from '@/api/auth';
import type { SessionPayload } from '@/types/auth';
import { mock_accounts, tenants_of } from '@/mocks/fixtures/auth';

const OK = '0';

function ok<T>(data: T): ApiEnvelope<T> {
  return { code: OK, msg: '', data };
}

function fail(code: string, msg: string): ApiEnvelope<never> {
  return { code, msg, data: null as never };
}

/** 按账号取登录态（登录成功才生成会话）。 */
function build_session(account: string): SessionPayload | null {
  const matched = mock_accounts.find((item) => item.account === account);
  if (matched == null) {
    return null;
  }
  return {
    access_token: `mock_jwt_${account}_${Date.now().toString(36)}`,
    user: matched.user,
    tenants: tenants_of(matched.tenant_ids),
  };
}

/** 认证接口 —— 按 docs/auth-contract.md 实现。 */
export const auth_handlers = [
  http.post('/api/authnexus/v1/auth/login', async ({ request }) => {
    const body = (await request.json()) as { account?: string; password?: string };
    const matched = mock_accounts.find(
      (item) => item.account === body.account && item.password === body.password,
    );
    if (matched == null) {
      return HttpResponse.json(fail('1004', '账号或密码错误'), { status: 200 });
    }

    const tenants = tenants_of(matched.tenant_ids);
    if (tenants.length > 1) {
      // 多企业 → 返回 login_ticket + tenants，待「选择企业」。ticket 内编码账号便于 mock 还原。
      const result: LoginResult = {
        login_ticket: `ticket_${matched.account}_${Date.now().toString(36)}`,
        tenants,
      };
      return HttpResponse.json(ok(result));
    }

    const session = build_session(matched.account);
    if (session == null) {
      return HttpResponse.json(fail('1004', '账号或密码错误'), { status: 200 });
    }
    const result: LoginResult = { session };
    return HttpResponse.json(ok(result));
  }),

  http.post('/api/authnexus/v1/auth/select-tenant', async ({ request }) => {
    const body = (await request.json()) as { login_ticket?: string; tenant_id?: string };
    const account = (body.login_ticket ?? '').replace(/^ticket_/, '').split('_')[0];
    const matched = mock_accounts.find((item) => item.account === account);
    if (matched == null || !matched.tenant_ids.includes(body.tenant_id ?? '')) {
      return HttpResponse.json(fail('1003', '企业不存在或无权访问'), { status: 200 });
    }
    const session = build_session(matched.account);
    if (session == null) {
      return HttpResponse.json(fail('1004', '会话已失效'), { status: 200 });
    }
    return HttpResponse.json(ok(session));
  }),

  http.post('/api/authnexus/v1/auth/refresh', async ({ request }) => {
    // Mock 模式：无真实 cookie，直接拒绝，前端跳登录。真实后端落地后由 cookie 驱动。
    const cookie = request.headers.get('cookie') ?? '';
    if (cookie === '') {
      return HttpResponse.json(fail('1004', '会话已过期'), { status: 200 });
    }
    return HttpResponse.json(fail('1004', '会话已过期'), { status: 200 });
  }),

  http.post('/api/authnexus/v1/auth/logout', () => HttpResponse.json(ok({}))),
  http.get('/api/authnexus/v1/auth/profile', () =>
    HttpResponse.json(
      fail('1004', '未认证'), // Mock 模式需前端已有会话；profile 走内存态即可
      { status: 200 },
    ),
  ),
  http.post('/api/authnexus/v1/auth/change-password', () => HttpResponse.json(ok({}))),
  http.post('/api/authnexus/v1/user/set-password', () => HttpResponse.json(ok({}))),
];
