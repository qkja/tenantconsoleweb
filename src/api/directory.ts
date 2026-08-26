import { request } from '@/api/client';
import type { DirectoryInfo, DirectoryListData } from '@/types/identityhub';

export interface ListDirectoryParams {
  page?: number;
  page_size?: number;
  keyword?: string;
}

export function list_directory(params?: ListDirectoryParams): Promise<DirectoryListData> {
  return request<DirectoryListData>('/identityhub/v1/directory/list', { params });
}

export function get_directory(domain: string): Promise<DirectoryInfo> {
  return request<DirectoryInfo>('/identityhub/v1/directory/get', { params: { domain } });
}

export interface CreateDirectoryInput {
  name: string;
  domain: string;
  description?: string;
}

export function create_directory(data: CreateDirectoryInput): Promise<void> {
  return request<void>('/identityhub/v1/directory/create', { method: 'POST', body: data });
}

export interface UpdateDirectoryInput {
  name?: string;
  description?: string;
}

/** Update 是全量覆盖非 patch —— 调用方负责 load-then-merge 全量提交。 */
export function update_directory(domain: string, data: UpdateDirectoryInput): Promise<void> {
  return request<void>('/identityhub/v1/directory/update', {
    method: 'PUT',
    body: { domain, ...data },
  });
}

export function delete_directory(domain: string): Promise<void> {
  return request<void>('/identityhub/v1/directory/delete', {
    method: 'DELETE',
    params: { domain },
  });
}
