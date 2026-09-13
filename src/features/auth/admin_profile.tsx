import { useQueryClient } from '@tanstack/react-query';
import { Alert, App, Button, Card, Descriptions, Form, Input, Modal, Skeleton, Tag } from 'antd';
import { useState } from 'react';
import { update_current_admin } from '@/api/tenant';
import { use_current_admin } from '@/hooks/queries/use_current_admin';
import { use_t } from '@/lib/i18n';
import './admin_profile.css';

interface NameFormValues {
  name: string;
}

/**
 * 管理员自助 —— 可改自己的 `name`（兼登录账号）。
 * 改名即换登录凭证：下次登录须用新名称；本次会话不受影响（D26）。
 */
export function AdminProfile() {
  const t = use_t();
  const { message } = App.useApp();
  const query_client = useQueryClient();
  const { data: admin, isLoading } = use_current_admin();
  const [open, set_open] = useState(false);
  const [submitting, set_submitting] = useState(false);
  const [form] = Form.useForm<NameFormValues>();

  const open_rename = () => {
    form.setFieldsValue({ name: admin?.name ?? '' });
    set_open(true);
  };

  const on_finish = async (values: NameFormValues) => {
    set_submitting(true);
    try {
      await update_current_admin({ name: values.name.trim() });
      message.success(t('account.saved'));
      set_open(false);
      void query_client.invalidateQueries({ queryKey: ['tenant', 'me', 'admin'] });
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    } finally {
      set_submitting(false);
    }
  };

  return (
    <div className="admin-profile">
      <Card
        className="admin-profile__card"
        title={t('account.title')}
        extra={
          <Button type="primary" onClick={open_rename}>
            {t('account.rename')}
          </Button>
        }
      >
        {isLoading || admin == null ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Descriptions
            column={1}
            size="middle"
            items={[
              { key: 'name', label: t('account.name'), children: admin.name },
              { key: 'email', label: t('account.email'), children: admin.email || '—' },
              { key: 'phone', label: t('account.phone'), children: admin.phone || '—' },
              {
                key: 'roles',
                label: t('account.roles'),
                children: admin.role_names.length > 0 ? admin.role_names.join('、') : '—',
              },
              {
                key: 'status',
                label: t('account.status'),
                children: (
                  <Tag color={admin.status === 'enable' ? 'green' : 'default'}>
                    {admin.status === 'enable' ? t('common.enable') : t('common.disable')}
                  </Tag>
                ),
              },
            ]}
          />
        )}
      </Card>

      <Modal
        title={t('account.rename')}
        open={open}
        onCancel={() => set_open(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Alert type="warning" showIcon message={t('account.rename_warning')} />
        <Form<NameFormValues>
          form={form}
          layout="vertical"
          onFinish={on_finish}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="name"
            label={t('account.name')}
            rules={[{ required: true, message: t('account.name_required') }]}
          >
            <Input placeholder={t('account.name')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
