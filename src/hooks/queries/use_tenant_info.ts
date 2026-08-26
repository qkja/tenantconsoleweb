import { useQuery } from '@tanstack/react-query';
import { get_tenant } from '@/api/tenant';
import type { TenantInfo } from '@/types/tenantmanager';

/** 企业信息（camelCase 契约）—— 以租户 domain 寻址。 */
export function use_tenant_info(tenant_domain: string | null) {
  return useQuery({
    queryKey: ['tenant', 'info', tenant_domain],
    queryFn: () => get_tenant(tenant_domain ?? ''),
    enabled: tenant_domain != null,
    staleTime: 60_000,
  });
}

export type { TenantInfo };
