import { http, HttpResponse } from 'msw';
import type { ApiEnvelope } from '@/api/envelope';
import type { SessionPayload } from '@/types/auth';
import { build_session, mock_tenant_admin_accounts } from '@/mocks/fixtures/auth';

const OK = '0';

function ok<T>(data: T): ApiEnvelope<T> {
  return { code: OK, msg: '', data };
}

function fail(code: string, msg: string): ApiEnvelope<never> {
  return { code, msg, data: null as never };
}

/** 租户管理员认证 —— 登录凭证 = 名称（name）。 */
export const auth_handlers = [
  http.post('/api/authnexus/v1/tenant/login', async ({ request }) => {
    const body = (await request.json()) as { name?: string; password?: string };
    const matched = mock_tenant_admin_accounts.find(
      (item) => item.name === body.name && item.password === body.password,
    );
    if (matched == null) {
      return HttpResponse.json(fail('1004', '名称或密码错误'), { status: 200 });
    }
    return HttpResponse.json<ApiEnvelope<SessionPayload>>(ok(build_session(matched.name)));
  }),

  http.post('/api/authnexus/v1/tenant/refresh', async ({ request }) => {
    // Mock 模式：无真实 cookie，直接拒绝，前端跳登录。真实后端落地后由 cookie 驱动。
    const cookie = request.headers.get('cookie') ?? '';
    if (cookie === '') {
      return HttpResponse.json(fail('1004', '会话已过期'), { status: 200 });
    }
    return HttpResponse.json(fail('1004', '会话已过期'), { status: 200 });
  }),

  http.post('/api/authnexus/v1/tenant/logout', () => HttpResponse.json(ok({}))),
  http.put('/api/authnexus/v1/tenant/password', () => HttpResponse.json(ok({}))),
];
