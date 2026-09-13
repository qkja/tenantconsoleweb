import { useQuery } from '@tanstack/react-query';
import { get_current_admin } from '@/api/tenant';
import type { TenantAdminInfo } from '@/types/tenantmanager';

/** 当前管理员（GetCurrentTenantAdmin）—— 登录账号即 `name`。 */
export function use_current_admin() {
  return useQuery({
    queryKey: ['tenant', 'me', 'admin'],
    queryFn: () => get_current_admin(),
    staleTime: 60_000,
  });
}

export type { TenantAdminInfo };
