import { QueryClient } from '@tanstack/react-query';

// 全局 QueryClient。10 QPS 限流约束下，用较长 staleTime 减少请求量。
const DEFAULT_STALE_TIME_MS = 30_000;

export const query_client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME_MS,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
