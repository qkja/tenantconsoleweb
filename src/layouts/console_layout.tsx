import { Layout, Spin } from 'antd';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { SideNav } from '@/layouts/side_nav';
import { TopBar } from '@/layouts/top_bar';
import './console_layout.css';

/** 控制台外壳：顶栏 + 侧栏 + 内容区（Outlet 承载懒加载子路由）。 */
export function ConsoleLayout() {
  return (
    <Layout className="console-layout">
      <TopBar />
      <Layout className="console-layout__body">
        <SideNav />
        <Layout.Content className="console-layout__content">
          <div className="console-layout__inner">
            <Suspense fallback={<Spin className="console-layout__spin" />}>
              <Outlet />
            </Suspense>
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
