import { request } from '@/api/client';
import type { SecurityGroupInfo } from '@/types/identityhub';

/**
 * 安全组接口。后端暂无 List —— 列表数据源由 Mock 补齐（阶段 6）。
 * 真实网关仅 get 详情。
 */
export function get_security_group(id: string, domain: string): Promise<SecurityGroupInfo> {
  return request<SecurityGroupInfo>('/identityhub/v1/security-group/get', {
    params: { id, domain },
  });
}

export interface CreateSecurityGroupInput {
  domain: string;
  name: string;
  description?: string;
}

export function create_security_group(data: CreateSecurityGroupInput): Promise<void> {
  return request<void>('/identityhub/v1/security-group/create', { method: 'POST', body: data });
}

export interface UpdateSecurityGroupInput {
  name?: string;
  description?: string;
}

/** Update 是全量覆盖非 patch。 */
export function update_security_group(
  id: string,
  domain: string,
  data: UpdateSecurityGroupInput,
): Promise<void> {
  return request<void>('/identityhub/v1/security-group/update', {
    method: 'PUT',
    body: { id, domain, ...data },
  });
}

export function delete_security_group(id: string, domain: string): Promise<void> {
  return request<void>('/identityhub/v1/security-group/delete', {
    method: 'DELETE',
    params: { id, domain },
  });
}
