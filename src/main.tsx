import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { App } from '@/app';
import { query_client } from '@/lib/query_client';
import '@/styles/tokens.css';
import '@/styles/typography.css';
import '@/styles/global.css';

// Mock 模式（VITE_USE_MOCKS=true，见 .env.mock）下，在渲染前启动 MSW。
// 切回真实后端只需关掉该开关 + 关闭 vite 代理即可，代码零改动。
async function enable_mocks() {
  const { worker } = await import('@/mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

async function bootstrap() {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    await enable_mocks();
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
