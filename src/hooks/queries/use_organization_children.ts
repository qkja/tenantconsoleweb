import { useQuery } from '@tanstack/react-query';
import { list_organization_children } from '@/api/organization';
import type { OrganizationInfo } from '@/types/identityhub';

/** 组织直接子级（物化路径树，按 parent_code 串行展开 —— 10 QPS 限流约束）。 */
export function use_organization_children(directory_code: string, parent_code: string | null) {
  return useQuery({
    queryKey: ['organization', 'children', directory_code, parent_code ?? 'root'],
    queryFn: () =>
      list_organization_children({
        directory_code,
        parent_code: parent_code ?? undefined,
        page: 1,
        page_size: 500,
      }),
    enabled: directory_code !== '',
    select: (data) => data.list as OrganizationInfo[],
    staleTime: 30_000,
  });
}
