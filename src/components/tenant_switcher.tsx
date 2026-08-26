import { DownOutlined, ShopOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { use_i18n } from '@/lib/i18n';
import { use_scope } from '@/stores/scope';
import { use_session } from '@/stores/session';
import type { TenantOption } from '@/types/auth';
import './tenant_switcher.css';

/**
 * 顶栏租户（企业）切换器 —— 企微「切换企业」。
 * 多企业场景下由认证流程（阶段 3）填充 tenants；切换后更新 scope 并同步 UI 语言。
 */
export function TenantSwitcher() {
  const { t, set_language } = use_i18n();
  const { tenants, is_authenticated } = use_session();
  const { tenant_id, set_tenant } = use_scope();

  const current = tenants.find((item) => item.tenant_id === tenant_id);

  const on_select = (tenant: TenantOption) => {
    set_tenant({
      tenant_id: tenant.tenant_id,
      tenant_domain: tenant.domain,
      ui_language: tenant.ui_language,
    });
    set_language(tenant.ui_language);
  };

  return (
    <Dropdown
      trigger={['click']}
      disabled={!is_authenticated || tenants.length === 0}
      menu={{
        items: tenants.map((tenant) => ({
          key: tenant.tenant_id,
          label: tenant.tenant_name,
          icon: <ShopOutlined />,
        })),
        onClick: ({ key }) => {
          const tenant = tenants.find((item) => item.tenant_id === key);
          if (tenant != null) {
            on_select(tenant);
          }
        },
      }}
    >
      <Button type="text" className="tenant-switcher">
        <Space size={4}>
          <ShopOutlined />
          <span className="tenant-switcher__name">
            {current?.tenant_name ?? t('topbar.tenant_switcher')}
          </span>
          <DownOutlined className="tenant-switcher__caret" />
        </Space>
      </Button>
    </Dropdown>
  );
}
