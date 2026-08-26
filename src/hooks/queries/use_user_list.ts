import { useQuery } from '@tanstack/react-query';
import { list_users } from '@/api/user';
import type { UserInfo } from '@/types/identityhub';

/** 成员列表（某目录域/组织下）。后端 ListUser 缺失时由 MSW 提供。 */
export function use_user_list(domain: string, org_id: string | null) {
  return useQuery({
    queryKey: ['user', 'list', domain, org_id ?? 'all'],
    queryFn: () =>
      list_users({
        domain,
        org_id: org_id ?? undefined,
        page: 1,
        page_size: 500,
      }),
    enabled: domain !== '',
    select: (data) => data.list as UserInfo[],
    staleTime: 30_000,
  });
}
