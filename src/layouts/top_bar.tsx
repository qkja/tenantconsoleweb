import { KeyOutlined, LogoutOutlined, TranslationOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Space, type MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/api/auth';
import { DirectorySwitcher } from '@/components/directory_switcher';
import { TenantSwitcher } from '@/components/tenant_switcher';
import { use_current_admin } from '@/hooks/queries/use_current_admin';
import { use_i18n, type Language } from '@/lib/i18n';
import { use_session } from '@/stores/session';
import './top_bar.css';

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'zh_CN', label: '简体中文' },
  { value: 'en_US', label: 'English' },
];

/** 顶栏：品牌 + 租户/目录域切换 + 语言 + 当前管理员。 */
export function TopBar() {
  const { t, language, set_language } = use_i18n();
  const { is_authenticated, clear_session } = use_session();
  const { data: admin } = use_current_admin();

  const display_name = admin?.name ?? '';
  const initial = display_name.slice(0, 1).toUpperCase();

  const language_items: MenuProps['items'] = LANGUAGE_OPTIONS.map((option) => ({
    key: option.value,
    label: option.label,
  }));

  const navigate = useNavigate();

  const user_items: MenuProps['items'] = [
    { key: 'admin-profile', label: t('topbar.my_account'), icon: <UserOutlined /> },
    { key: 'change-password', label: t('topbar.change_password'), icon: <KeyOutlined /> },
    { type: 'divider' },
    { key: 'logout', label: t('topbar.logout'), icon: <LogoutOutlined /> },
  ];

  const on_user_menu_click: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'admin-profile') {
      navigate('/admin-profile');
      return;
    }
    if (key === 'change-password') {
      navigate('/change-password');
      return;
    }
    if (key === 'logout') {
      // 先通知后端失效 refresh cookie，再清理内存会话并回登录页。
      try {
        await logout();
      } catch {
        // 登出失败不阻塞本地清理。
      }
      clear_session();
      navigate('/login', { replace: true });
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
