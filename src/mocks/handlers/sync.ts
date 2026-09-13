import { http, HttpResponse } from 'msw';
import type { ApiEnvelope, PageData } from '@/api/envelope';
import type {
  SyncConfigInfo,
  SyncFieldMapping,
  SyncRecordFailureInfo,
  SyncRecordInfo,
} from '@/types/identityhub';
import { mock_sync_configs, mock_sync_failures, mock_sync_records } from '@/mocks/fixtures/sync';

const OK = '0';

function random_code(prefix: string): string {
  const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  let ulid = '';
  for (let i = 0; i < 26; i += 1) {
    ulid += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}_${ulid}`;
}

/** 同步 —— 配置查询/更新、手工触发、记录列表、失败明细。 */
export const sync_handlers = [
  http.get('/api/identityhub/v1/sync/config/get', ({ request }) => {
    const url = new URL(request.url);
    const directory_code = url.searchParams.get('directory_code') ?? '';
    const config = mock_sync_configs.find((item) => item.directory_code === directory_code);
    if (config == null) {
      return HttpResponse.json<ApiEnvelope<never>>({
        code: '2004',
        msg: '该目录域无同步配置',
        data: null as never,
      });
    }
    return HttpResponse.json<ApiEnvelope<SyncConfigInfo>>({ code: OK, msg: '', data: config });
  }),

  http.put('/api/identityhub/v1/sync/config/update', async ({ request }) => {
    const body = (await request.json()) as Partial<SyncConfigInfo> & {
      bind_password?: string;
      field_mappings?: SyncFieldMapping[];
    };
    const config = mock_sync_configs.find((item) => item.directory_code === body.directory_code);
    if (config != null) {
      config.server_url = body.server_url ?? config.server_url;
      config.base_dn = body.base_dn ?? config.base_dn;
      config.bind_dn = body.bind_dn ?? config.bind_dn;
      config.external_id_field = body.external_id_field ?? config.external_id_field;
      config.field_mappings = body.field_mappings ?? config.field_mappings;
      config.sync_interval_minutes = body.sync_interval_minutes ?? config.sync_interval_minutes;
      config.enabled = body.enabled ?? config.enabled;
      config.scope_organization = body.scope_organization ?? config.scope_organization;
      config.scope_user = body.scope_user ?? config.scope_user;
      config.scope_user_role = body.scope_user_role ?? config.scope_user_role;
    }
    return HttpResponse.json<ApiEnvelope<never>>({ code: OK, msg: '', data: null as never });
  }),

  http.post('/api/identityhub/v1/sync/trigger', async ({ request }) => {
    const body = (await request.json()) as { directory_code?: string };
    const record: SyncRecordInfo = {
      sync_record_code: random_code('syn'),
      directory_code: body.directory_code ?? '',
      trigger_type: 'manual',
      status: 'running',
      started_at: Math.floor(Date.now() / 1000),
      finished_at: 0,
      total_count: 0,
      success_count: 0,
      failed_count: 0,
    };
    mock_sync_records.unshift(record);
    return HttpResponse.json<ApiEnvelope<{ sync_record_code: string }>>({
      code: OK,
      msg: '',
      data: { sync_record_code: record.sync_record_code },
    });
  }),

  http.get('/api/identityhub/v1/sync/records/list', ({ request }) => {
    const url = new URL(request.url);
    const directory_code = url.searchParams.get('directory_code') ?? '';
    const status = url.searchParams.get('status') ?? '';
    const list = mock_sync_records.filter((record) => {
      const match_dir = directory_code === '' || record.directory_code === directory_code;
      const match_status = status === '' || record.status === status;
      return match_dir && match_status;
    });
    const data: PageData & { list: SyncRecordInfo[] } = {
      total: list.length,
      page: 1,
      page_size: 500,
      list,
    };
    return HttpResponse.json<ApiEnvelope<typeof data>>({ code: OK, msg: '', data });
  }),

  http.get('/api/identityhub/v1/sync/records/failures', () => {
    // 失败明细按 sync_record_code 查询；mock 直接回传全部夹具，响应形状与 `.api` 对齐。
    const data: PageData & { list: SyncRecordFailureInfo[] } = {
      total: mock_sync_failures.length,
      page: 1,
      page_size: 500,
      list: mock_sync_failures,
    };
    return HttpResponse.json<ApiEnvelope<typeof data>>({ code: OK, msg: '', data });
  }),
];
