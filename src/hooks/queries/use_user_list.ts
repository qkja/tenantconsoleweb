import { useQuery } from '@tanstack/react-query';
import { list_users } from '@/api/user';
import type { UserInfo } from '@/types/identityhub';

/**
 * 成员列表（某目录域 / 组织下）—— 真实网关 ListUser。
 * keyword 命中 name/email/phone/description 模糊匹配（后端按 search_fields 白名单）。
 */
export function use_user_list(
  directory_code: string,
  organization_code: string | null,
  keyword = '',
) {
  const trimmed = keyword.trim();
  return useQuery({
    queryKey: ['user', 'list', directory_code, organization_code ?? 'all', trimmed],
    queryFn: () =>
      list_users({
        directory_code,
        organization_code: organization_code ?? undefined,
        keyword: trimmed !== '' ? trimmed : undefined,
        page: 1,
        page_size: 500,
        sort_by: 'created_at',
        descending: 'desc',
      }),
    enabled: directory_code !== '',
    select: (data) => data.list as UserInfo[],
    staleTime: 30_000,
  });
}
