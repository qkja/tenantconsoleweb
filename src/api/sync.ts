import { request } from '@/api/client';
import type { PageData } from '@/api/envelope';
import type {
  SyncConfigInfo,
  SyncFieldMapping,
  SyncRecordFailureInfo,
  SyncRecordInfo,
} from '@/types/identityhub';

/**
 * 第三方身份源同步 —— 仅 ad / ldap 目录域有同步配置（local 拒绝）。
 * 前缀 `/identityhub/v1/sync`。单向（外部 → 本平台），不回写。
 */

export function get_sync_config(directory_code: string): Promise<SyncConfigInfo> {
  return request<SyncConfigInfo>('/identityhub/v1/sync/config/get', {
    params: { directory_code },
  });
}

/** 全量更新配置 —— 绑定密码仅可写不可读；空 = 不修改。字段映射传则整体覆盖。 */
export interface UpdateSyncConfigInput {
  directory_code: string;
  server_url: string;
  base_dn?: string;
  bind_dn?: string;
  bind_password?: string;
  external_id_field: string;
  field_mappings?: SyncFieldMapping[];
  sync_interval_minutes?: number;
  enabled?: boolean;
  scope_organization?: boolean;
  scope_user?: boolean;
  scope_user_role?: boolean;
}

export function update_sync_config(data: UpdateSyncConfigInput): Promise<void> {
  return request<void>('/identityhub/v1/sync/config/update', {
    method: 'PUT',
    body: data,
  });
}

export function trigger_sync(directory_code: string): Promise<{ sync_record_code: string }> {
  return request<{ sync_record_code: string }>('/identityhub/v1/sync/trigger', {
    method: 'POST',
    body: { directory_code },
  });
}

export type SyncRecordListData = PageData & { list: SyncRecordInfo[] };

export interface ListSyncRecordsParams {
  keyword?: string;
  page?: number;
  page_size?: number;
  search_fields?: string[];
  directory_code?: string;
  status?: string;
  start_time?: number;
  end_time?: number;
  sort_by?: string;
  descending?: string;
}

export function list_sync_records(params?: ListSyncRecordsParams): Promise<SyncRecordListData> {
  return request<SyncRecordListData>('/identityhub/v1/sync/records/list', { params });
}

export type SyncRecordFailureListData = PageData & { list: SyncRecordFailureInfo[] };

export interface ListSyncRecordFailuresParams {
  sync_record_code: string;
  keyword?: string;
  page?: number;
  page_size?: number;
  search_fields?: string[];
  sort_by?: string;
  descending?: string;
}

export function list_sync_record_failures(
  params: ListSyncRecordFailuresParams,
): Promise<SyncRecordFailureListData> {
  return request<SyncRecordFailureListData>('/identityhub/v1/sync/records/failures', { params });
}
