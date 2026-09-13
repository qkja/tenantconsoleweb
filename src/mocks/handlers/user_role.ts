import { http, HttpResponse } from 'msw';
import type { ApiEnvelope, PageData } from '@/api/envelope';
import type { UserRoleInfo, UserRoleMemberInfo } from '@/types/identityhub';
import { mock_user_roles } from '@/mocks/fixtures/user_role';
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

/** 用户角色（uro）—— 列表 / 增删改查 / 状态 / 成员（绑定方 users.user_role_codes）。 */
export const user_role_handlers = [
  http.get('/api/identityhub/v1/user-roles/list', ({ request }) => {
    const url = new URL(request.url);
    const directory_code = url.searchParams.get('directory_code') ?? '';
    const list = mock_user_roles.filter((role) =>
      directory_code === '' ? true : role.directory_code === directory_code,
    );
    const data: PageData & { list: UserRoleInfo[] } = {
      total: list.length,
      page: 1,
      page_size: 500,
      list,
    };
    return HttpResponse.json<ApiEnvelope<typeof data>>({ code: OK, msg: '', data });
  }),

  http.get('/api/identityhub/v1/user-roles/get', ({ request }) => {
    const url = new URL(request.url);
    const user_role_code = url.searchParams.get('user_role_code') ?? '';
    const role = mock_user_roles.find((item) => item.user_role_code === user_role_code);
    if (role == null) {
      return HttpResponse.json<ApiEnvelope<never>>({
        code: '2003',
        msg: '用户角色不存在',
        data: null as never,
      });
    }
    return HttpResponse.json<ApiEnvelope<UserRoleInfo>>({ code: OK, msg: '', data: role });
  }),

  http.post('/api/identityhub/v1/user-roles/create', async ({ request }) => {
    const body = (await request.json()) as {
      directory_code?: string;
      name?: string;
      description?: string;
    };
    const created: UserRoleInfo = {
      user_role_code: random_code('uro'),
      directory_code: body.directory_code ?? '',
      name: body.name ?? '',
      description: body.description ?? '',
      status: 'enable',
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };
    mock_user_roles.push(created);
    return HttpResponse.json<ApiEnvelope<{ user_role_code: string }>>({
      code: OK,
      msg: '',
      data: { user_role_code: created.user_role_code },
    });
  }),

  http.put('/api/identityhub/v1/user-roles/update', async ({ request }) => {
    const body = (await request.json()) as { user_role_code?: string; name?: string; description?: string };
    const role = mock_user_roles.find((item) => item.user_role_code === body.user_role_code);
    if (role != null) {
      if (body.name != null) {
        role.name = body.name;
      }
      if (body.description != null) {
        role.description = body.description;
      }
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.delete('/api/identityhub/v1/user-roles/delete', async ({ request }) => {
    const body = (await request.json()) as { user_role_code?: string };
    const index = mock_user_roles.findIndex((item) => item.user_role_code === body.user_role_code);
    if (index !== -1) {
      mock_user_roles.splice(index, 1);
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.put('/api/identityhub/v1/user-roles/status', async ({ request }) => {
    const body = (await request.json()) as { user_role_code?: string; status?: string };
    const role = mock_user_roles.find((item) => item.user_role_code === body.user_role_code);
    if (role != null) {
      role.status = body.status === 'disable' ? 'disable' : 'enable';
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.get('/api/identityhub/v1/user-roles/members', ({ request }) => {
    const url = new URL(request.url);
    const user_role_code = url.searchParams.get('user_role_code') ?? '';
    const members: UserRoleMemberInfo[] = mock_users
      .filter((user) => user.user_role_codes.includes(user_role_code))
      .map((user) => ({ user_code: user.user_code, name: user.name }));
    const data: PageData & { list: UserRoleMemberInfo[] } = {
      total: members.length,
      page: 1,
      page_size: 500,
      list: members,
    };
    return HttpResponse.json<ApiEnvelope<typeof data>>({ code: OK, msg: '', data });
  }),

  http.post('/api/identityhub/v1/user-roles/members', async ({ request }) => {
    const body = (await request.json()) as { user_role_code?: string; user_codes?: string[] };
    for (const user of mock_users) {
      if (body.user_codes?.includes(user.user_code) && !user.user_role_codes.includes(body.user_role_code ?? '')) {
        user.user_role_codes = [...user.user_role_codes, body.user_role_code ?? ''];
      }
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.delete('/api/identityhub/v1/user-roles/members', async ({ request }) => {
    const body = (await request.json()) as { user_role_code?: string; user_codes?: string[] };
    for (const user of mock_users) {
      if (body.user_codes?.includes(user.user_code)) {
        user.user_role_codes = user.user_role_codes.filter((code) => code !== body.user_role_code);
      }
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),
];
