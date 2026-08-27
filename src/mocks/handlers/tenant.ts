import { http, HttpResponse } from 'msw';
import type { ApiEnvelope } from '@/api/envelope';
import type { AddAdminParams, TenantAdminInfo, TenantInfo } from '@/types/tenantmanager';
import { mock_tenant_admins, mock_tenant_info } from '@/mocks/fixtures/tenant';

const OK = '0';

/** 企业信息 —— tenantmanagersvr 编译失败，整模块 Mock。 */
export const tenant_handlers = [
  http.get('/api/tenantmanager/v1/tenant/get', ({ request }) => {
    const url = new URL(request.url);
    const domain = url.searchParams.get('domain') ?? '';
    if (domain !== mock_tenant_info.domain) {
      return HttpResponse.json<ApiEnvelope<never>>({
        code: '1003',
        msg: '企业不存在',
        data: null as never,
      });
    }
    return HttpResponse.json<ApiEnvelope<TenantInfo>>({
      code: OK,
      msg: '',
      data: mock_tenant_info,
    });
  }),

  // ---- 租户管理员管理（P3 §2.2） ----

  http.get('/api/tenantmanager/v1/tenant/admins', () => {
    return HttpResponse.json<ApiEnvelope<TenantAdminInfo[]>>({
      code: OK,
      msg: '',
      data: mock_tenant_admins,
    });
  }),

  http.post('/api/tenantmanager/v1/tenant/admins/add', async ({ request }) => {
    const body = (await request.json()) as Partial<AddAdminParams>;
    if (body.account == null || body.password == null) {
      return HttpResponse.json<ApiEnvelope<never>>({
        code: '1002',
        msg: '参数无效',
        data: null as never,
      });
    }
    mock_tenant_admins.push({
      account: body.account,
      displayName: body.displayName ?? body.account,
      status: 'enable',
    });
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.put('/api/tenantmanager/v1/tenant/admins/status', async ({ request }) => {
    const body = (await request.json()) as { account?: string; status?: string };
    const admin = mock_tenant_admins.find((a) => a.account === body.account);
    if (admin == null) {
      return HttpResponse.json<ApiEnvelope<never>>({
        code: '1003',
        msg: '管理员不存在',
        data: null as never,
      });
    }
    admin.status = body.status === 'disable' ? 'disable' : 'enable';
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),
];
