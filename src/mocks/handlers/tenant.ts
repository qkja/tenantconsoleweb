import { http, HttpResponse } from 'msw';
import type { ApiEnvelope } from '@/api/envelope';
import type { TenantAdminInfo, TenantInfo } from '@/types/tenantmanager';
import { mock_current_admin, mock_current_tenant } from '@/mocks/fixtures/tenant';

const OK = '0';

/** 租户自助 + 管理员自助 —— tenantmanager 域（tenant 作用域由网关注入）。 */
export const tenant_handlers = [
  http.get('/api/tenantmanager/v1/me', () =>
    HttpResponse.json<ApiEnvelope<TenantInfo>>({ code: OK, msg: '', data: mock_current_tenant }),
  ),

  http.put('/api/tenantmanager/v1/me', async ({ request }) => {
    const body = (await request.json()) as Partial<TenantInfo>;
    Object.assign(mock_current_tenant, body);
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.get('/api/tenantmanager/v1/me/admin', () =>
    HttpResponse.json<ApiEnvelope<TenantAdminInfo>>({
      code: OK,
      msg: '',
      data: mock_current_admin,
    }),
  ),

  http.put('/api/tenantmanager/v1/me/admin', async ({ request }) => {
    const body = (await request.json()) as Partial<TenantAdminInfo>;
    if (body.name != null) {
      mock_current_admin.name = body.name;
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),
];
