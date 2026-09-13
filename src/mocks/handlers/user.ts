import { http, HttpResponse } from 'msw';
import type { ApiEnvelope, PageData } from '@/api/envelope';
import type { UserInfo } from '@/types/identityhub';
import { mock_users } from '@/mocks/fixtures/user';

const OK = '0';

function random_code(prefix: string): string {
  const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  let ulid = '';
  for (let i = 0; i < 26; i += 1) {
    ulid += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}_${ulid}`;
}

/** 成员 —— 列表（keyword / directory_code / organization_code 过滤）与增删改查 / 状态。 */
export const user_handlers = [
  http.get('/api/identityhub/v1/users/list', ({ request }) => {
    const url = new URL(request.url);
    const directory_code = url.searchParams.get('directory_code') ?? '';
    const organization_code = url.searchParams.get('organization_code');
    const keyword = url.searchParams.get('keyword') ?? '';

    const list = mock_users.filter((user) => {
      if (directory_code !== '' && user.directory_code !== directory_code) {
        return false;
      }
      if (organization_code != null && user.organization_code !== organization_code) {
        return false;
      }
      if (keyword !== '' && !user.name.includes(keyword) && !user.email.includes(keyword)) {
        return false;
      }
      return true;
    });

    const data: PageData & { list: UserInfo[] } = {
      list,
      total: list.length,
      page: 1,
      page_size: 500,
    };
    return HttpResponse.json<ApiEnvelope<typeof data>>({ code: OK, msg: '', data });
  }),

  http.get('/api/identityhub/v1/users/get', ({ request }) => {
    const url = new URL(request.url);
    const user_code = url.searchParams.get('user_code') ?? '';
    const user = mock_users.find((item) => item.user_code === user_code);
    if (user == null) {
      return HttpResponse.json<ApiEnvelope<never>>({ code: '2002', msg: '用户不存在', data: null as never });
    }
    return HttpResponse.json<ApiEnvelope<UserInfo>>({ code: OK, msg: '', data: user });
  }),

  http.post('/api/identityhub/v1/users/create', async ({ request }) => {
    const body = (await request.json()) as Partial<UserInfo> & { password?: string };
    const created: UserInfo = {
      user_code: random_code('usr'),
      directory_code: body.directory_code ?? '',
      organization_code: body.organization_code ?? '',
      name: body.name ?? '',
      email: body.email ?? '',
      country_code: body.country_code ?? '',
      phone: body.phone ?? '',
      description: body.description ?? '',
      source: 'local',
      external_id: '',
      status: body.status ?? 'enable',
      max_login_failures: 5,
      login_fail_window: 15,
      login_fail_window_unit: 'minute',
      failed_login_count: 0,
      is_locked: false,
      must_change_password: body.must_change_password ?? false,
      user_role_codes: body.user_role_codes ?? [],
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };
    mock_users.push(created);
    return HttpResponse.json<ApiEnvelope<{ user_code: string }>>({
      code: OK,
      msg: '',
      data: { user_code: created.user_code },
    });
  }),

  http.put('/api/identityhub/v1/users/update', async ({ request }) => {
    const body = (await request.json()) as Partial<UserInfo>;
    const user = mock_users.find((item) => item.user_code === body.user_code);
    if (user != null) {
      const keys = [
        'name',
        'email',
        'country_code',
        'phone',
        'description',
        'organization_code',
      ] as const;
      for (const key of keys) {
        if (body[key] != null) {
          (user as unknown as Record<string, unknown>)[key] = body[key];
        }
      }
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.delete('/api/identityhub/v1/users/delete', async ({ request }) => {
    const body = (await request.json()) as { user_code?: string };
    const index = mock_users.findIndex((item) => item.user_code === body.user_code);
    if (index !== -1) {
      mock_users.splice(index, 1);
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.put('/api/identityhub/v1/users/status', async ({ request }) => {
    const body = (await request.json()) as { user_code?: string; status?: string };
    const user = mock_users.find((item) => item.user_code === body.user_code);
    if (user != null) {
      user.status = body.status === 'disable' ? 'disable' : 'enable';
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),
];
