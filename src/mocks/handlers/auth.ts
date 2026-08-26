import { http, HttpResponse } from 'msw';
import type { ApiEnvelope } from '@/api/envelope';
import type { SessionPayload, SessionTenant, SessionUser } from '@/types/auth';
import { mock_tenant_accounts, mock_user_accounts, tenant_of } from '@/mocks/fixtures/auth';

const OK = '0';

function ok<T>(data: T): ApiEnvelope<T> {
  return { code: OK, msg: '', data };
}

function fail(code: string, msg: string): ApiEnvelope<never> {
  return { code, msg, data: null as never };
}

function build_session(domain: string, user: SessionUser): SessionPayload {
  const tenant = tenant_of(domain) as SessionTenant;
  return {
    access_token: `mock_jwt_${domain}_${Date.now().toString(36)}`,
    user,
    tenant,
  };
}

/** 认证接口 —— 按 docs/auth-contract.md 实现。账号 = 租户 domain。 */
export const auth_handlers = [
  http.post('/api/authnexus/v1/auth/login', async ({ request }) => {
    const body = (await request.json()) as {
      domain?: string;
      password?: string;
      account?: string;
    };

    const domain = body.domain ?? '';
    if (tenant_of(domain) == null) {
      return HttpResponse.json(fail('1003', '企业不存在'), { status: 200 });
    }

    // 用户认证（成员）：domain + account + password。
    if (body.account != null && body.account !== '') {
      const matched = mock_user_accounts.find(
        (item) =>
          item.domain === domain &&
          item.account === body.account &&
          item.password === body.password,
      );
      if (matched == null) {
        return HttpResponse.json(fail('1004', '账号或密码错误'), { status: 200 });
      }
      return HttpResponse.json(ok(build_session(domain, matched.user)));
    }

    // 租户认证（管理员）：domain 即账号。
    const matched = mock_tenant_accounts.find(
      (item) => item.domain === domain && item.password === body.password,
    );
    if (matched == null) {
      return HttpResponse.json(fail('1004', '域标识或密码错误'), { status: 200 });
    }
    return HttpResponse.json(ok(build_session(domain, matched.user)));
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
    HttpResponse.json(fail('1004', '未认证'), { status: 200 }),
  ),
  http.post('/api/authnexus/v1/auth/change-password', () => HttpResponse.json(ok({}))),
  http.post('/api/authnexus/v1/user/set-password', () => HttpResponse.json(ok({}))),
];
