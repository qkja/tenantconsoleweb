import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PlusOutlined } from '@ant-design/icons';
import {
  App,
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Modal,
  Popconfirm,
  Skeleton,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { add_admin, list_admins, set_admin_status } from '@/api/tenant';
import { use_scope } from '@/stores/scope';
import { use_tenant_info } from '@/hooks/queries/use_tenant_info';
import { use_t } from '@/lib/i18n';
import type { TenantAdminInfo } from '@/types/tenantmanager';
import './tenant_page.css';

interface AdminFormValues {
  account: string;
  display_name: string;
  password: string;
}

/** 企业信息 + 管理员管理 —— 以租户 domain 寻址（tenantmanagersvr 真实网关）。 */
export function TenantPage() {
  const t = use_t();
  const { message } = App.useApp();
  const query_client = useQueryClient();
  const { tenant_domain } = use_scope();
  const { data: tenant, isLoading } = use_tenant_info(tenant_domain);

  const { data: admins = [] } = useQuery<TenantAdminInfo[]>({
    queryKey: ['tenant', 'admins'],
    queryFn: () => list_admins(),
  });

  const [add_open, set_add_open] = useState(false);
  const [submitting, set_submitting] = useState(false);
  const [form] = Form.useForm<AdminFormValues>();

  const invalidate = () => {
    void query_client.invalidateQueries({ queryKey: ['tenant', 'admins'] });
  };

  const on_toggle = async (account: string, status: 'enable' | 'disable') => {
    try {
      await set_admin_status({ account, status });
      message.success(status === 'disable' ? t('admin.disabled') : t('admin.enabled'));
      invalidate();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const on_add = async (values: AdminFormValues) => {
    set_submitting(true);
    try {
      await add_admin({
        account: values.account,
        displayName: values.display_name,
        password: values.password,
      });
      message.success(t('admin.added'));
      set_add_open(false);
      form.resetFields();
      invalidate();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    } finally {
      set_submitting(false);
    }
  };

  const columns: ColumnsType<TenantAdminInfo> = [
    { title: t('admin.account'), dataIndex: 'account', key: 'account' },
    { title: t('admin.display_name'), dataIndex: 'displayName', key: 'displayName' },
    {
      title: t('admin.status'),
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: string) => (
        <Tag color={status === 'enable' ? 'green' : 'default'}>
          {status === 'enable' ? t('common.enable') : t('common.disable')}
        </Tag>
      ),
    },
    {
      title: t('common.actions'),
      key: 'action',
      width: 90,
      render: (_: unknown, record: TenantAdminInfo) =>
        record.status === 'enable' ? (
          <Popconfirm
            title={t('admin.disable_confirm')}
            onConfirm={() => void on_toggle(record.account, 'disable')}
          >
            <Button type="link" size="small" danger>
              {t('common.disable')}
            </Button>
          </Popconfirm>
        ) : (
          <Popconfirm
            title={t('admin.enable_confirm')}
            onConfirm={() => void on_toggle(record.account, 'enable')}
          >
            <Button type="link" size="small">
              {t('common.enable')}
            </Button>
          </Popconfirm>
        ),
    },
  ];

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

      <Card
        className="tenant-page__card"
        title={t('admin.title')}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => set_add_open(true)}>
            {t('admin.add')}
          </Button>
        }
      >
        <Table<TenantAdminInfo>
          rowKey="account"
          columns={columns}
          dataSource={admins}
          pagination={false}
        />
      </Card>

      <Modal
        title={t('admin.add')}
        open={add_open}
        onCancel={() => set_add_open(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form<AdminFormValues> form={form} layout="vertical" onFinish={on_add}>
          <Form.Item
            name="account"
            label={t('admin.account')}
            rules={[{ required: true, message: t('admin.account_required') }]}
          >
            <Input placeholder={t('admin.account')} />
          </Form.Item>
          <Form.Item
            name="display_name"
            label={t('admin.display_name')}
            rules={[{ required: true, message: t('admin.display_name_required') }]}
          >
            <Input placeholder={t('admin.display_name')} />
          </Form.Item>
          <Form.Item
            name="password"
            label={t('admin.password')}
            rules={[{ required: true, message: t('admin.password_required') }]}
          >
            <Input.Password placeholder={t('admin.password')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
