import { ShopOutlined } from '@ant-design/icons';
import { use_i18n } from '@/lib/i18n';
import { use_session } from '@/stores/session';
import './tenant_switcher.css';

/**
 * 顶栏当前企业展示 —— 单租户（登录账号即租户 domain，无多企业切换）。
 * 显示企业名 + 域标识。
 */
export function TenantSwitcher() {
  const { t } = use_i18n();
  const { tenant } = use_session();

  return (
    <span className="tenant-switcher" role="status">
      <ShopOutlined className="tenant-switcher__icon" />
      <span className="tenant-switcher__name">
        {tenant?.tenant_name ?? t('topbar.tenant_switcher')}
      </span>
      {tenant != null ? <span className="tenant-switcher__domain">{tenant.domain}</span> : null}
    </span>
  );
}
