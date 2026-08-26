import { http, HttpResponse } from 'msw';
import type { ApiEnvelope } from '@/api/envelope';
import type { TenantInfo } from '@/types/tenantmanager';
import { mock_tenant_info } from '@/mocks/fixtures/tenant';

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
];
