import { http, HttpResponse } from 'msw';
import type { ApiEnvelope } from '@/api/envelope';
import type { OrganizationInfo } from '@/types/identityhub';
import { mock_organizations } from '@/mocks/fixtures/organization';

const OK = '0';

/** 组织子级 —— Mock 模式下按 domain+parent_id 返回（物化路径树串行展开）。 */
export const organization_handlers = [
  http.get('/api/identityhub/v1/organization/children', ({ request }) => {
    const url = new URL(request.url);
    const domain = url.searchParams.get('domain') ?? '';
    const parent_id = url.searchParams.get('parent_id') ?? '';

    const list = mock_organizations.filter(
      (org) => org.domain === domain && org.parent_id === parent_id,
    );
    return HttpResponse.json<
      ApiEnvelope<{ list: OrganizationInfo[]; total: number; page: number; page_size: number }>
    >({
      code: OK,
      msg: '',
      data: { list, total: list.length, page: 1, page_size: 500 },
    });
  }),

  http.get('/api/identityhub/v1/organization/get', ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id') ?? '';
    const org = mock_organizations.find((item) => item.id === id);
    if (org == null) {
      return HttpResponse.json<ApiEnvelope<never>>({
        code: '1001',
        msg: '部门不存在',
        data: null as never,
      });
    }
    return HttpResponse.json<ApiEnvelope<OrganizationInfo>>({
      code: OK,
      msg: '',
      data: org,
    });
  }),
];
