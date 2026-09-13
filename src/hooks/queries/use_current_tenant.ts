import { useQuery } from '@tanstack/react-query';
import { get_current_tenant } from '@/api/tenant';
import type { TenantInfo } from '@/types/tenantmanager';

/** 当前租户资料（GetCurrentTenant）—— 复用 TenantInfo，status 留空。 */
export function use_current_tenant() {
  return useQuery({
    queryKey: ['tenant', 'me'],
    queryFn: () => get_current_tenant(),
    staleTime: 60_000,
  });
}

export type { TenantInfo };
