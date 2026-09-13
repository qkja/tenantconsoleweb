import { http, HttpResponse } from 'msw';
import type { ApiEnvelope, PageData } from '@/api/envelope';
import type { DirectoryInfo, DirectoryType } from '@/types/identityhub';
import { mock_directories } from '@/mocks/fixtures/directory';

const OK = '0';

function random_code(prefix: string): string {
  const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  let ulid = '';
  for (let i = 0; i < 26; i += 1) {
    ulid += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}_${ulid}`;
}

/** 目录域 —— 列表 / 增删改查 / 状态。 */
export const directory_handlers = [
  http.get('/api/identityhub/v1/directories/list', ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword') ?? '';
    const list =
      keyword === ''
        ? mock_directories
        : mock_directories.filter((item) => item.name.includes(keyword));
    const data: PageData & { list: DirectoryInfo[] } = {
      total: list.length,
      page: 1,
      page_size: 100,
      list,
    };
    return HttpResponse.json<ApiEnvelope<typeof data>>({ code: OK, msg: '', data });
  }),

  http.get('/api/identityhub/v1/directories/get', ({ request }) => {
    const url = new URL(request.url);
    const directory_code = url.searchParams.get('directory_code') ?? '';
    const dir = mock_directories.find((item) => item.directory_code === directory_code);
    if (dir == null) {
      return HttpResponse.json<ApiEnvelope<never>>({
        code: '2001',
        msg: '目录域不存在',
        data: null as never,
      });
    }
    return HttpResponse.json<ApiEnvelope<DirectoryInfo>>({ code: OK, msg: '', data: dir });
  }),

  http.post('/api/identityhub/v1/directories/create', async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      type?: DirectoryType;
      description?: string;
    };
    const created: DirectoryInfo = {
      directory_code: random_code('dir'),
      name: body.name ?? '',
      type: body.type ?? 'local',
      description: body.description ?? '',
      status: 'enable',
      sync_configured: false,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
    };
    mock_directories.push(created);
    return HttpResponse.json<ApiEnvelope<{ directory_code: string }>>({
      code: OK,
      msg: '',
      data: { directory_code: created.directory_code },
    });
  }),

  http.put('/api/identityhub/v1/directories/update', async ({ request }) => {
    const body = (await request.json()) as {
      directory_code?: string;
      name?: string;
      description?: string;
    };
    const dir = mock_directories.find((item) => item.directory_code === body.directory_code);
    if (dir != null) {
      if (body.name != null) {
        dir.name = body.name;
      }
      if (body.description != null) {
        dir.description = body.description;
      }
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.delete('/api/identityhub/v1/directories/delete', async ({ request }) => {
    const body = (await request.json()) as { directory_code?: string };
    const index = mock_directories.findIndex((item) => item.directory_code === body.directory_code);
    if (index !== -1) {
      mock_directories.splice(index, 1);
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.put('/api/identityhub/v1/directories/status', async ({ request }) => {
    const body = (await request.json()) as { directory_code?: string; status?: string };
    const dir = mock_directories.find((item) => item.directory_code === body.directory_code);
    if (dir != null) {
      dir.status = body.status === 'disable' ? 'disable' : 'enable';
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),
];
