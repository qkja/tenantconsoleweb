import { request } from '@/api/client';
import type { PageData } from '@/api/envelope';
import type { OrganizationInfo } from '@/types/identityhub';

export type OrganizationListData = PageData & { list: OrganizationInfo[] };

export interface ListOrganizationChildrenParams {
  directory_code: string;
  parent_code?: string;
  page?: number;
  page_size?: number;
}

/** 组织直接子级（物化路径树，按 parent_code 串行展开 —— 10 QPS 限流约束）。 */
export function list_organization_children(
  params: ListOrganizationChildrenParams,
): Promise<OrganizationListData> {
  return request<OrganizationListData>('/identityhub/v1/organization/children', { params });
}

export interface CreateOrganizationInput {
  directory_code: string;
  parent_code?: string;
  name: string;
  description?: string;
}

export function create_organization(data: CreateOrganizationInput): Promise<void> {
  return request<void>('/identityhub/v1/organization/create', { method: 'POST', body: data });
}

export interface UpdateOrganizationInput {
  name?: string;
  description?: string;
}

/** 部分更新 —— 仅名称与描述。 */
export function update_organization(
  organization_code: string,
  directory_code: string,
  data: UpdateOrganizationInput,
): Promise<void> {
  return request<void>('/identityhub/v1/organization/update', {
    method: 'PUT',
    body: { organization_code, directory_code, ...data },
  });
}

export function delete_organization(organization_code: string, directory_code: string): Promise<void> {
  return request<void>('/identityhub/v1/organization/delete', {
    method: 'DELETE',
    params: { organization_code, directory_code },
  });
}
