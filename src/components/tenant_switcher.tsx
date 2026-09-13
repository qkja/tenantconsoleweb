import { ShopOutlined } from '@ant-design/icons';
import { use_current_tenant } from '@/hooks/queries/use_current_tenant';
import { use_i18n } from '@/lib/i18n';
import './tenant_switcher.css';

/** 顶栏当前企业展示 —— 显示客户名称（GetCurrentTenant）。 */
export function TenantSwitcher() {
  const { t } = use_i18n();
  const { data: tenant } = use_current_tenant();

  return (
    <span className="tenant-switcher" role="status">
      <ShopOutlined className="tenant-switcher__icon" />
      <span className="tenant-switcher__name">
        {tenant?.customer_name ?? t('topbar.tenant_switcher')}
      </span>
    </span>
  );
}
