import { Card, Descriptions, Skeleton, Tag } from 'antd';
import { use_scope } from '@/stores/scope';
import { use_tenant_info } from '@/hooks/queries/use_tenant_info';
import { use_t } from '@/lib/i18n';
import './tenant_page.css';

/** 企业信息 —— tenantmanagersvr 编译失败，由 MSW 提供（docs/backend-gap-list.md）。 */
export function TenantPage() {
  const t = use_t();
  const { tenant_id } = use_scope();
  const { data: tenant, isLoading } = use_tenant_info(tenant_id);

  return (
    <div className="tenant-page">
      <Card className="tenant-page__card" title={t('tenant.company_profile')}>
        {isLoading || tenant == null ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <Descriptions
            column={1}
            size="middle"
            items={[
              { key: 'name', label: t('tenant.name'), children: tenant.name },
              { key: 'code', label: t('tenant.code'), children: tenant.code },
              { key: 'domain', label: t('tenant.domain'), children: tenant.domain },
              { key: 'contact', label: t('tenant.contact_name'), children: tenant.contactName },
              { key: 'phone', label: t('tenant.contact_phone'), children: tenant.contactPhone },
              { key: 'email', label: t('tenant.contact_email'), children: tenant.contactEmail },
              {
                key: 'status',
                label: t('tenant.status'),
                children: <Tag color="green">{tenant.status}</Tag>,
              },
              { key: 'remark', label: t('tenant.remark'), children: tenant.remark || '—' },
              {
                key: 'created',
                label: t('tenant.created_at'),
                children: tenant.createTime || '—',
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}
