import { useQuery } from '@tanstack/react-query';
import { list_organization_children } from '@/api/organization';
import type { OrganizationInfo } from '@/types/identityhub';

/** 组织直接子级（物化路径树，按 parent_id 串行展开 —— 10 QPS 限流约束）。 */
export function use_organization_children(domain: string, parent_id: string | null) {
  return useQuery({
    queryKey: ['organization', 'children', domain, parent_id ?? 'root'],
    queryFn: () =>
      list_organization_children({
        domain,
        parent_id: parent_id ?? undefined,
        page: 1,
        page_size: 500,
      }),
    enabled: domain !== '',
    select: (data) => data.list as OrganizationInfo[],
    staleTime: 30_000,
  });
}
