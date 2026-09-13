import { useQueryClient } from '@tanstack/react-query';
import { App, Button, Card, Descriptions, Form, Input, Modal, Select, Skeleton } from 'antd';
import { useState } from 'react';
import { update_current_tenant } from '@/api/tenant';
import { use_current_tenant } from '@/hooks/queries/use_current_tenant';
import { format_unix_time } from '@/lib/format';
import { use_t } from '@/lib/i18n';
import './tenant_page.css';

interface TenantFormValues {
  customer_name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  language: string;
}

const LANGUAGE_OPTIONS = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en-US', label: 'English' },
];

/**
 * 租户自助 —— 客户名称 / 联系方式 / 地址 / 默认业务语言。
 * 不改 status（租户启停属平台管理员），不含登录账号字段（管理员名称在 /me/admin 维护）。
 */
export function TenantPage() {
  const t = use_t();
  const { message } = App.useApp();
  const query_client = useQueryClient();
  const { data: tenant, isLoading } = use_current_tenant();
  const [open, set_open] = useState(false);
  const [submitting, set_submitting] = useState(false);
  const [form] = Form.useForm<TenantFormValues>();

  const open_edit = () => {
    form.setFieldsValue({
      customer_name: tenant?.customer_name ?? '',
      contact_name: tenant?.contact_name ?? '',
      phone: tenant?.phone ?? '',
      email: tenant?.email ?? '',
      address: tenant?.address ?? '',
      language: tenant?.language ?? 'zh-CN',
    });
    set_open(true);
  };

  const on_finish = async (values: TenantFormValues) => {
    set_submitting(true);
    try {
      await update_current_tenant({
        customer_name: values.customer_name,
        contact_name: values.contact_name,
        phone: values.phone,
        email: values.email,
        address: values.address,
        language: values.language,
      });
      message.success(t('common.saved'));
      set_open(false);
      void query_client.invalidateQueries({ queryKey: ['tenant', 'me'] });
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    } finally {
      set_submitting(false);
    }
  };

  return (
    <div className="tenant-page">
      <Card
        className="tenant-page__card"
        title={t('tenant.company_profile')}
        extra={
          <Button type="primary" onClick={open_edit}>
            {t('tenant.edit')}
          </Button>
        }
      >
        {isLoading || tenant == null ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <Descriptions
            column={1}
            size="middle"
            items={[
              { key: 'customer_name', label: t('tenant.customer_name'), children: tenant.customer_name },
              { key: 'contact_name', label: t('tenant.contact_name'), children: tenant.contact_name || '—' },
              { key: 'phone', label: t('tenant.phone'), children: tenant.phone || '—' },
              { key: 'email', label: t('tenant.email'), children: tenant.email || '—' },
              { key: 'address', label: t('tenant.address'), children: tenant.address || '—' },
              { key: 'language', label: t('tenant.language'), children: tenant.language },
              { key: 'created_at', label: t('tenant.created_at'), children: format_unix_time(tenant.created_at) },
            ]}
          />
        )}
      </Card>

      <Modal
        title={t('tenant.edit')}
        open={open}
        onCancel={() => set_open(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form<TenantFormValues> form={form} layout="vertical" onFinish={on_finish}>
          <Form.Item
            name="customer_name"
            label={t('tenant.customer_name')}
            rules={[{ required: true, message: t('tenant.customer_name_required') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="contact_name" label={t('tenant.contact_name')}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label={t('tenant.phone')}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label={t('tenant.email')} rules={[{ type: 'email', message: t('common.email_invalid') }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label={t('tenant.address')}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="language" label={t('tenant.language')}>
            <Select options={LANGUAGE_OPTIONS} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
