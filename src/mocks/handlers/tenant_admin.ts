import { http, HttpResponse } from 'msw';
import type { ApiEnvelope, PageData } from '@/api/envelope';
import type { TenantAdminInfo } from '@/types/tenantmanager';
import { mock_tenant_admins } from '@/mocks/fixtures/tenant_admin';
import { mock_tenant_roles } from '@/mocks/fixtures/tenant_role';

const OK = '0';

function random_code(prefix: string): string {
  const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  let ulid = '';
  for (let i = 0; i < 26; i += 1) {
    ulid += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}_${ulid}`;
}

function role_names(role_codes: string[]): string[] {
  return role_codes
    .map((code) => mock_tenant_roles.find((role) => role.tenant_role_code === code)?.name ?? code)
    .filter((name) => name !== '');
}

/** 租户管理员（tnu）—— 列表 / 增删改查 / 状态 / 绑角色（全量覆盖）/ 重置密码。 */
export const tenant_admin_handlers = [
  http.get('/api/tenantmanager/v1/tenant-admins/list', () => {
    const data: PageData & { list: TenantAdminInfo[] } = {
      total: mock_tenant_admins.length,
      page: 1,
      page_size: 500,
      list: mock_tenant_admins,
    };
    return HttpResponse.json<ApiEnvelope<typeof data>>({ code: OK, msg: '', data });
  }),

  http.get('/api/tenantmanager/v1/tenant-admins/get', ({ request }) => {
    const url = new URL(request.url);
    const tenant_admin_code = url.searchParams.get('tenant_admin_code') ?? '';
    const admin = mock_tenant_admins.find((item) => item.tenant_admin_code === tenant_admin_code);
    if (admin == null) {
      return HttpResponse.json<ApiEnvelope<never>>({
        code: '3002',
        msg: '租户管理员不存在',
        data: null as never,
      });
    }
    return HttpResponse.json<ApiEnvelope<TenantAdminInfo>>({ code: OK, msg: '', data: admin });
  }),

  http.post('/api/tenantmanager/v1/tenant-admins/create', async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      country_code?: string;
      phone?: string;
      email?: string;
      role_codes?: string[];
      must_change_password?: boolean;
      status?: string;
      max_login_failures?: number;
      login_fail_window?: number;
      login_fail_window_unit?: string;
      is_locked?: boolean;
    };
    const codes = body.role_codes ?? [];
    const created: TenantAdminInfo = {
      tenant_admin_code: random_code('tnu'),
      name: body.name ?? '',
      email: body.email ?? '',
      country_code: body.country_code ?? '',
      phone: body.phone ?? '',
      status: body.status === 'disable' ? 'disable' : 'enable',
      max_login_failures: body.max_login_failures ?? 5,
      login_fail_window: body.login_fail_window ?? 15,
      login_fail_window_unit: (body.login_fail_window_unit ?? 'minute') as TenantAdminInfo['login_fail_window_unit'],
      failed_login_count: 0,
      is_locked: body.is_locked ?? false,
      must_change_password: body.must_change_password ?? false,
      role_codes: codes,
      role_names: role_names(codes),
      is_initial: false,
      last_login_at: 0,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };
    mock_tenant_admins.push(created);
    return HttpResponse.json<ApiEnvelope<{ tenant_admin_code: string }>>({
      code: OK,
      msg: '',
      data: { tenant_admin_code: created.tenant_admin_code },
    });
  }),

  http.put('/api/tenantmanager/v1/tenant-admins/update', async ({ request }) => {
    const body = (await request.json()) as {
      tenant_admin_code?: string;
      name?: string;
      country_code?: string;
      phone?: string;
      email?: string;
      max_login_failures?: number;
      login_fail_window?: number;
      login_fail_window_unit?: string;
      is_locked?: boolean;
    };
    const admin = mock_tenant_admins.find((item) => item.tenant_admin_code === body.tenant_admin_code);
    if (admin != null) {
      if (body.name != null) {
        admin.name = body.name;
      }
      if (body.country_code != null) {
        admin.country_code = body.country_code;
      }
      if (body.phone != null) {
        admin.phone = body.phone;
      }
      if (body.email != null) {
        admin.email = body.email;
      }
      if (body.max_login_failures != null) {
        admin.max_login_failures = body.max_login_failures;
      }
      if (body.login_fail_window != null) {
        admin.login_fail_window = body.login_fail_window;
      }
      if (body.login_fail_window_unit != null) {
        admin.login_fail_window_unit = body.login_fail_window_unit as TenantAdminInfo['login_fail_window_unit'];
      }
      if (body.is_locked != null) {
        admin.is_locked = body.is_locked;
      }
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.delete('/api/tenantmanager/v1/tenant-admins/delete', async ({ request }) => {
    const body = (await request.json()) as { tenant_admin_code?: string };
    const index = mock_tenant_admins.findIndex(
      (item) => item.tenant_admin_code === body.tenant_admin_code,
    );
    if (index !== -1) {
      mock_tenant_admins.splice(index, 1);
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.put('/api/tenantmanager/v1/tenant-admins/status', async ({ request }) => {
    const body = (await request.json()) as { tenant_admin_code?: string; status?: string };
    const admin = mock_tenant_admins.find((item) => item.tenant_admin_code === body.tenant_admin_code);
    if (admin != null) {
      admin.status = body.status === 'disable' ? 'disable' : 'enable';
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.put('/api/tenantmanager/v1/tenant-admins/roles', async ({ request }) => {
    const body = (await request.json()) as { tenant_admin_code?: string; role_codes?: string[] };
    const admin = mock_tenant_admins.find((item) => item.tenant_admin_code === body.tenant_admin_code);
    if (admin != null) {
      const codes = body.role_codes ?? [];
      admin.role_codes = codes;
      admin.role_names = role_names(codes);
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.put('/api/tenantmanager/v1/tenant-admins/reset-password', async ({ request }) => {
    const body = (await request.json()) as { tenant_admin_code?: string };
    const admin = mock_tenant_admins.find((item) => item.tenant_admin_code === body.tenant_admin_code);
    if (admin != null) {
      admin.must_change_password = true;
    }
    return HttpResponse.json<ApiEnvelope<{ new_password: string }>>({
      code: OK,
      msg: '',
      data: { new_password: random_code('Tmp').replace('_', '') },
    });
  }),
];
