import { App as AntdApp, ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { RouterProvider } from 'react-router-dom';
import { I18nProvider, use_i18n, type Language } from '@/lib/i18n';
import { app_theme } from '@/lib/theme';
import { router } from '@/router';

const antd_locales: Record<Language, typeof zhCN> = {
  zh_CN: zhCN,
  en_US: enUS,
};

/** Provider 链：i18n → antd ConfigProvider（locale/主题）→ App（message/notification）→ Router。 */
function ThemedApp() {
  const { language } = use_i18n();
  return (
    <ConfigProvider locale={antd_locales[language]} theme={app_theme}>
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  );
}

export function App() {
  return (
    <I18nProvider>
      <ThemedApp />
    </I18nProvider>
  );
}
