import { ShopOutlined } from '@ant-design/icons';
import { App, Button } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { select_tenant } from '@/api/auth';
import { use_i18n } from '@/lib/i18n';
import { use_scope } from '@/stores/scope';
import { use_session } from '@/stores/session';
import type { TenantOption } from '@/types/auth';
import './tenant_picker.css';

interface TenantPickerProps {
  login_ticket: string;
  tenants: TenantOption[];
}

/** 多企业选择页 —— 企微「选择企业」。凭 login_ticket 选定后换取正式会话。 */
export function TenantPicker({ login_ticket, tenants }: TenantPickerProps) {
  const { t } = use_i18n();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const set_session = use_session((state) => state.set_session);
  const set_tenant = use_scope((state) => state.set_tenant);
  const [selecting, set_selecting] = useState<string | null>(null);

  const on_select = async (tenant: TenantOption) => {
    set_selecting(tenant.tenant_id);
    try {
      const session = await select_tenant(login_ticket, tenant.tenant_id);
      set_session(session);
      set_tenant({
        tenant_id: tenant.tenant_id,
        tenant_domain: tenant.domain,
        ui_language: tenant.ui_language,
      });
      navigate('/overview', { replace: true });
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
      set_selecting(null);
    }
  };

  return (
    <div className="tenant-picker">
      <div className="tenant-picker__card">
        <h1 className="tenant-picker__title">{t('auth.select_tenant')}</h1>
        <p className="tenant-picker__hint">{t('auth.select_tenant_hint')}</p>

        <div className="tenant-picker__list">
          {tenants.map((tenant) => (
            <Button
              key={tenant.tenant_id}
              block
              size="large"
              className="tenant-picker__item"
              loading={selecting === tenant.tenant_id}
              icon={<ShopOutlined />}
              onClick={() => on_select(tenant)}
            >
              <span className="tenant-picker__name">{tenant.tenant_name}</span>
              <span className="tenant-picker__domain">{tenant.domain}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
