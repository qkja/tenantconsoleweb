import { useQuery } from '@tanstack/react-query';
import { list_directory } from '@/api/directory';
import type { DirectoryInfo } from '@/types/identityhub';

export const DIRECTORY_LIST_KEY = ['directory', 'list'] as const;

/** 目录域列表（真实网关 :8888）。切换器与目录管理页共用。 */
export function use_directory_list() {
  return useQuery({
    queryKey: [...DIRECTORY_LIST_KEY],
    queryFn: () => list_directory({ page: 1, page_size: 100 }),
    select: (data) => data.list as DirectoryInfo[],
    staleTime: 60_000,
  });
}
