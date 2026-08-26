import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 全局 antd Provider 链：ConfigProvider（locale/主题）+ App（message/notification 上下文）。
// 阶段 1 起在 App 内接入 RouterProvider 与控制台外壳。
export function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AntdApp>
        <main className="scaffold-page">
          <h1>租户控制台</h1>
          <p>脚手架就绪 — 阶段 1 起接入控制台外壳与路由。</p>
        </main>
      </AntdApp>
    </ConfigProvider>
  );
}
