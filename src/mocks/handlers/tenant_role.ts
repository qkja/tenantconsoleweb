import { http, HttpResponse } from 'msw';
import type { ApiEnvelope, PageData } from '@/api/envelope';
import type { TenantRoleInfo } from '@/types/tenantmanager';
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

/** 内置角色保护 —— 与后端硬拦对齐：不可删 / 不可改 / 不可停用。 */
function is_builtin(tenant_role_code: string): boolean {
  return mock_tenant_roles.some((role) => role.tenant_role_code === tenant_role_code && role.built_in);
}

/** 租户管理角色（tro）—— 列表 / 增删改查 / 状态。 */
export const tenant_role_handlers = [
  http.get('/api/tenantmanager/v1/tenant-roles/list', () => {
    const data: PageData & { list: TenantRoleInfo[] } = {
      total: mock_tenant_roles.length,
      page: 1,
      page_size: 500,
      list: mock_tenant_roles,
    };
    return HttpResponse.json<ApiEnvelope<typeof data>>({ code: OK, msg: '', data });
  }),

  http.get('/api/tenantmanager/v1/tenant-roles/get', ({ request }) => {
    const url = new URL(request.url);
    const tenant_role_code = url.searchParams.get('tenant_role_code') ?? '';
    const role = mock_tenant_roles.find((item) => item.tenant_role_code === tenant_role_code);
    if (role == null) {
      return HttpResponse.json<ApiEnvelope<never>>({
        code: '3003',
        msg: '租户管理角色不存在',
        data: null as never,
      });
    }
    return HttpResponse.json<ApiEnvelope<TenantRoleInfo>>({ code: OK, msg: '', data: role });
  }),

  http.post('/api/tenantmanager/v1/tenant-roles/create', async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      description?: string;
      page_codes?: string[];
      scope_organization_codes?: string[];
      scope_directory_codes?: string[];
    };
    const created: TenantRoleInfo = {
      tenant_role_code: random_code('tro'),
      name: body.name ?? '',
      description: body.description ?? '',
      status: 'enable',
      built_in: false,
      page_codes: body.page_codes ?? [],
      scope_organization_codes: body.scope_organization_codes ?? [],
      scope_directory_codes: body.scope_directory_codes ?? [],
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };
    mock_tenant_roles.push(created);
    return HttpResponse.json<ApiEnvelope<{ tenant_role_code: string }>>({
      code: OK,
      msg: '',
      data: { tenant_role_code: created.tenant_role_code },
    });
  }),

  http.put('/api/tenantmanager/v1/tenant-roles/update', async ({ request }) => {
    const body = (await request.json()) as {
      tenant_role_code?: string;
      name?: string;
      description?: string;
      page_codes?: string[];
      scope_organization_codes?: string[];
      scope_directory_codes?: string[];
    };
    if (is_builtin(body.tenant_role_code ?? '')) {
      return HttpResponse.json<ApiEnvelope<never>>({
        code: '3004',
        msg: '内置角色不可修改',
        data: null as never,
      });
    }
    const role = mock_tenant_roles.find((item) => item.tenant_role_code === body.tenant_role_code);
    if (role != null) {
      if (body.name != null) {
        role.name = body.name;
      }
      if (body.description != null) {
        role.description = body.description;
      }
      if (body.page_codes != null) {
        role.page_codes = body.page_codes;
      }
      if (body.scope_organization_codes != null) {
        role.scope_organization_codes = body.scope_organization_codes;
      }
      if (body.scope_directory_codes != null) {
        role.scope_directory_codes = body.scope_directory_codes;
      }
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.delete('/api/tenantmanager/v1/tenant-roles/delete', async ({ request }) => {
    const body = (await request.json()) as { tenant_role_code?: string };
    if (is_builtin(body.tenant_role_code ?? '')) {
      return HttpResponse.json<ApiEnvelope<never>>({
        code: '3004',
        msg: '内置角色不可删除',
        data: null as never,
      });
    }
    const index = mock_tenant_roles.findIndex(
      (item) => item.tenant_role_code === body.tenant_role_code,
    );
    if (index !== -1) {
      mock_tenant_roles.splice(index, 1);
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.put('/api/tenantmanager/v1/tenant-roles/status', async ({ request }) => {
    const body = (await request.json()) as { tenant_role_code?: string; status?: string };
    if (is_builtin(body.tenant_role_code ?? '')) {
      return HttpResponse.json<ApiEnvelope<never>>({
        code: '3004',
        msg: '内置角色不可停用',
        data: null as never,
      });
    }
    const role = mock_tenant_roles.find((item) => item.tenant_role_code === body.tenant_role_code);
    if (role != null) {
      role.status = body.status === 'disable' ? 'disable' : 'enable';
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),
];
