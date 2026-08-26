import { http, HttpResponse } from 'msw';
import type { ApiEnvelope } from '@/api/envelope';
import type { PageEnvelope } from '@/api/envelope';
import type { UserInfo } from '@/types/identityhub';
import { mock_users } from '@/mocks/fixtures/user';

const OK = '0';

/**
 * 成员 mock —— 仅 dev:mock 全量模式（VITE_MOCK_SCOPE=all）注册；
 * dev 真实后端模式用户管理已走真实网关（ListUser/SearchUser），本组不参与。
 * 按 domain/org_id 过滤夹具。
 */
export const user_handlers = [
  http.get('/api/identityhub/v1/user/list', ({ request }) => {
    const url = new URL(request.url);
    const domain = url.searchParams.get('domain') ?? '';
    const org_id = url.searchParams.get('org_id');

    const list = mock_users.filter(
      (user) => user.domain === domain && (org_id == null || user.primary_org_id === org_id),
    );

    const envelope: ApiEnvelope<PageEnvelope<UserInfo>> = {
      code: OK,
      msg: '',
      data: { list, total: list.length },
    };
    return HttpResponse.json(envelope);
  }),

  http.post('/api/identityhub/v1/user/create', async ({ request }) => {
    const body = (await request.json()) as Partial<UserInfo>;
    const created: UserInfo = {
      id: `u_mock_${Date.now().toString(36)}`,
      tenant_id: body.tenant_id ?? 't_001',
      domain: body.domain ?? '1000001',
      username: body.username ?? '',
      phone: body.phone ?? '',
      email: body.email ?? '',
      display_name: body.display_name ?? '',
      avatar: body.avatar ?? '',
      external_id: body.external_id ?? '',
      primary_org_id: body.primary_org_id ?? '',
      status: body.status ?? 'enable',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mock_users.push(created);
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.delete('/api/identityhub/v1/user/delete', ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id') ?? '';
    const index = mock_users.findIndex((user) => user.id === id);
    if (index !== -1) {
      mock_users.splice(index, 1);
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),
];
