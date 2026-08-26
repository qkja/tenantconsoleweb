import { useQuery } from '@tanstack/react-query';
import { list_users, search_users } from '@/api/user';
import type { UserInfo } from '@/types/identityhub';

/**
 * 成员列表（某目录域/组织下）—— 真实网关。
 * keyword 非空走 /search（identityhubsvr SearchUser），否则走 /list（ListUser，org_id 过滤）。
 */
export function use_user_list(domain: string, org_id: string | null, keyword = '') {
  const trimmed = keyword.trim();
  return useQuery({
    queryKey: ['user', 'list', domain, org_id ?? 'all', trimmed],
    queryFn: () => {
      if (trimmed !== '') {
        return search_users({ domain, keyword: trimmed, page: 1, page_size: 500 });
      }
      return list_users({
        domain,
        org_id: org_id ?? undefined,
        page: 1,
        page_size: 500,
      });
    },
    enabled: domain !== '',
    select: (data) => data.list as UserInfo[],
    staleTime: 30_000,
  });
}
