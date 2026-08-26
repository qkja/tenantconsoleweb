import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
// antd v5 官方 React 19 兼容补丁（须在 antd 使用前引入）。
import '@ant-design/v5-patch-for-react-19';
import { App } from '@/app';
import { query_client } from '@/lib/query_client';
import '@/styles/tokens.css';
import '@/styles/typography.css';
import '@/styles/global.css';

// Mock 作用域（VITE_MOCK_SCOPE，见 .env / .env.mock）：
//   auth —— dev 真实后端模式：认证后端未落地，仅认证走 MSW；用户管理等其余走真实网关。
//   all  —— dev:mock 全量模式：所有后端缺失接口均走 MSW，无需后端。
// 渲染前启动 MSW；留空则不启动。
async function enable_mocks(scope: 'all' | 'auth') {
  const { get_worker } = await import('@/mocks/browser');
  const worker = get_worker(scope);
  await worker.start({ onUnhandledRequest: 'bypass' });
}

async function bootstrap() {
  const mock_scope = import.meta.env.VITE_MOCK_SCOPE;
  if (mock_scope === 'all' || mock_scope === 'auth') {
    await enable_mocks(mock_scope);
  }
  const container = document.getElementById('root');
  if (container == null) {
    throw new Error('root container missing');
  }
  createRoot(container).render(
    <StrictMode>
      <QueryClientProvider client={query_client}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
}

void bootstrap();
