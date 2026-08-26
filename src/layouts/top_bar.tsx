import { LogoutOutlined, TranslationOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Space, type MenuProps } from 'antd';
import { DirectorySwitcher } from '@/components/directory_switcher';
import { TenantSwitcher } from '@/components/tenant_switcher';
import { use_i18n, type Language } from '@/lib/i18n';
import { use_session } from '@/stores/session';
import './top_bar.css';

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'zh_CN', label: '简体中文' },
  { value: 'en_US', label: 'English' },
];

/** 顶栏：品牌 + 租户/目录域切换 + 语言 + 当前用户。 */
export function TopBar() {
  const { t, language, set_language } = use_i18n();
  const { user, is_authenticated, clear_session } = use_session();

  const display_name = user?.display_name ?? user?.username ?? '';
  const initial = display_name.slice(0, 1).toUpperCase();

  const language_items: MenuProps['items'] = LANGUAGE_OPTIONS.map((option) => ({
    key: option.value,
    label: option.label,
  }));

  const user_items: MenuProps['items'] = [
    { key: 'logout', label: t('topbar.logout'), icon: <LogoutOutlined /> },
  ];

  const on_user_menu_click: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      // 阶段 3 接入 auth.logout API 后再清理；此处仅清内存会话。
      clear_session();
    }
  };

  return (
    <Layout.Header className="top-bar">
      <div className="top-bar__brand">
        <div className="top-bar__logo" aria-hidden>
          企
        </div>
        <span className="top-bar__app-name">{t('app.name')}</span>
      </div>

      <div className="top-bar__actions">
        <TenantSwitcher />
        <DirectorySwitcher />

        <Dropdown
          trigger={['click']}
          menu={{
            items: language_items,
            selectable: true,
            selectedKeys: [language],
            onClick: ({ key }) => set_language(key as Language),
          }}
        >
          <Button type="text" className="top-bar__icon-btn" aria-label={t('topbar.language')}>
            <TranslationOutlined />
          </Button>
        </Dropdown>

        <Dropdown trigger={['click']} menu={{ items: user_items, onClick: on_user_menu_click }}>
          <div className="top-bar__user" role="button" tabIndex={0}>
            <Space size={8}>
              <Avatar size={28} className="top-bar__avatar" icon={<UserOutlined />}>
                {initial || null}
              </Avatar>
              {is_authenticated ? <span className="top-bar__username">{display_name}</span> : null}
            </Space>
          </div>
        </Dropdown>
      </div>
    </Layout.Header>
  );
}
