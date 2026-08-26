import { http, HttpResponse } from 'msw';
import type { ApiEnvelope } from '@/api/envelope';
import type { SecurityGroupInfo } from '@/types/identityhub';
import { mock_security_groups } from '@/mocks/fixtures/security_group';

const OK = '0';

/** 安全组列表 —— 后端 ListSecurityGroup 缺失；get/create/update/delete 走真实网关。 */
export const security_group_handlers = [
  http.get('/api/identityhub/v1/security-group/list', ({ request }) => {
    const url = new URL(request.url);
    const domain = url.searchParams.get('domain') ?? '';
    const list = mock_security_groups.filter((group) => group.domain === domain);
    return HttpResponse.json<ApiEnvelope<{ list: SecurityGroupInfo[]; total: number }>>({
      code: OK,
      msg: '',
      data: { list, total: list.length },
    });
  }),
];
