import { http, HttpResponse } from 'msw';
import type { ApiEnvelope, PageData } from '@/api/envelope';
import type { OrganizationInfo } from '@/types/identityhub';
import { mock_organizations } from '@/mocks/fixtures/organization';

const OK = '0';

function random_code(prefix: string): string {
  const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  let ulid = '';
  for (let i = 0; i < 26; i += 1) {
    ulid += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}_${ulid}`;
}

/** 组织子级 —— 按 directory_code + parent_code 返回（物化路径树串行展开）。 */
export const organization_handlers = [
  http.get('/api/identityhub/v1/organization/children', ({ request }) => {
    const url = new URL(request.url);
    const directory_code = url.searchParams.get('directory_code') ?? '';
    const parent_code = url.searchParams.get('parent_code') ?? '';

    const list = mock_organizations.filter(
      (org) => org.directory_code === directory_code && org.parent_code === parent_code,
    );
    const data: PageData & { list: OrganizationInfo[] } = {
      list,
      total: list.length,
      page: 1,
      page_size: 500,
    };
    return HttpResponse.json<ApiEnvelope<typeof data>>({ code: OK, msg: '', data });
  }),

  http.post('/api/identityhub/v1/organization/create', async ({ request }) => {
    const body = (await request.json()) as {
      directory_code?: string;
      parent_code?: string;
      name?: string;
      description?: string;
    };
    const code = random_code('org');
    const parent = mock_organizations.find((org) => org.organization_code === body.parent_code);
    mock_organizations.push({
      organization_code: code,
      directory_code: body.directory_code ?? '',
      parent_code: body.parent_code ?? '',
      name: body.name ?? '',
      description: body.description ?? '',
      org_type: 'dept',
      external_id: '',
      level: parent != null ? parent.level + 1 : 0,
      path: parent != null ? `${parent.path}${code}/` : `/${code}/`,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    });
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.put('/api/identityhub/v1/organization/update', async ({ request }) => {
    const body = (await request.json()) as {
      organization_code?: string;
      name?: string;
      description?: string;
    };
    const org = mock_organizations.find((item) => item.organization_code === body.organization_code);
    if (org != null) {
      if (body.name != null) {
        org.name = body.name;
      }
      if (body.description != null) {
        org.description = body.description;
      }
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.delete('/api/identityhub/v1/organization/delete', ({ request }) => {
    const url = new URL(request.url);
    const organization_code = url.searchParams.get('organization_code') ?? '';
    const index = mock_organizations.findIndex((item) => item.organization_code === organization_code);
    if (index !== -1) {
      mock_organizations.splice(index, 1);
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),
];
