import { request } from '@/api/client';
import type { OrganizationInfo, OrganizationListData } from '@/types/identityhub';

export interface ListOrganizationChildrenParams {
  domain: string;
  parent_id?: string;
  page?: number;
  page_size?: number;
}

/** 物化路径树：按 parent_id 取直接子级（串行展开，10 QPS 限流约束）。 */
export function list_organization_children(
  params: ListOrganizationChildrenParams,
): Promise<OrganizationListData> {
  return request<OrganizationListData>('/identityhub/v1/organization/children', { params });
}

export function get_organization(id: string, domain: string): Promise<OrganizationInfo> {
  return request<OrganizationInfo>('/identityhub/v1/organization/get', { params: { id, domain } });
}

export interface SearchOrganizationParams {
  domain: string;
  keyword: string;
  page?: number;
  page_size?: number;
}

export function search_organization(
  params: SearchOrganizationParams,
): Promise<OrganizationListData> {
  return request<OrganizationListData>('/identityhub/v1/organization/search', { params });
}

export interface CreateOrganizationInput {
  domain: string;
  parent_id?: string;
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

/** Update 是全量覆盖非 patch。 */
export function update_organization(
  id: string,
  domain: string,
  data: UpdateOrganizationInput,
): Promise<void> {
  return request<void>('/identityhub/v1/organization/update', {
    method: 'PUT',
    body: { id, domain, ...data },
  });
}

export function delete_organization(id: string, domain: string): Promise<void> {
  return request<void>('/identityhub/v1/organization/delete', {
    method: 'DELETE',
    params: { id, domain },
  });
}
