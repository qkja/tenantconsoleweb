import { useQuery } from '@tanstack/react-query';
import { get_tenant } from '@/api/tenant';
import type { TenantInfo } from '@/types/tenantmanager';

/** 企业信息（camelCase 契约）—— tenantmanagersvr 编译失败，由 MSW 提供。 */
export function use_tenant_info(tenant_id: string | null) {
  return useQuery({
    queryKey: ['tenant', 'info', tenant_id],
    queryFn: () => get_tenant(tenant_id ?? ''),
    enabled: tenant_id != null,
    staleTime: 60_000,
  });
}

export type { TenantInfo };
