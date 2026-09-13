import { request } from '@/api/client';
import type { PageData } from '@/api/envelope';
import type { DirectoryInfo, DirectoryType } from '@/types/identityhub';

export interface ListDirectoryParams {
  keyword?: string;
  page?: number;
  page_size?: number;
  search_fields?: string[];
  type?: DirectoryType;
  status?: string;
  sort_by?: string;
  descending?: string;
}

export type DirectoryListData = PageData & { list: DirectoryInfo[] };

export function list_directory(params?: ListDirectoryParams): Promise<DirectoryListData> {
  return request<DirectoryListData>('/identityhub/v1/directories/list', { params });
}

export function get_directory(directory_code: string): Promise<DirectoryInfo> {
  return request<DirectoryInfo>('/identityhub/v1/directories/get', {
    params: { directory_code },
  });
}

export interface CreateDirectoryInput {
  name: string;
  type: DirectoryType;
  description?: string;
}

export function create_directory(data: CreateDirectoryInput): Promise<{ directory_code: string }> {
  return request<{ directory_code: string }>('/identityhub/v1/directories/create', {
    method: 'POST',
    body: data,
  });
}

export interface UpdateDirectoryInput {
  name?: string;
  description?: string;
}

/** 部分更新（§1.5）—— 仅名称与描述；type 不可变。 */
export function update_directory(
  directory_code: string,
  data: UpdateDirectoryInput,
): Promise<void> {
  return request<void>('/identityhub/v1/directories/update', {
    method: 'PUT',
    body: { directory_code, ...data },
  });
}

export function delete_directory(directory_code: string): Promise<void> {
  return request<void>('/identityhub/v1/directories/delete', {
    method: 'DELETE',
    body: { directory_code },
  });
}

export function update_directory_status(
  directory_code: string,
  status: 'enable' | 'disable',
): Promise<void> {
  return request<void>('/identityhub/v1/directories/status', {
    method: 'PUT',
    body: { directory_code, status },
  });
}
