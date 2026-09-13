import { KeyOutlined, PlusOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { useQuery } from '@tanstack/react-query';
import { App, Button, Modal, Popconfirm, Select, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import {
  delete_tenant_admin,
  list_tenant_admins,
  reset_tenant_admin_password,
  set_tenant_admin_roles,
  update_tenant_admin_status,
} from '@/api/tenant_admin';
import { list_tenant_roles } from '@/api/tenant_role';
import { TenantAdminForm } from '@/features/tenant_admin/tenant_admin_form';
import { format_unix_time } from '@/lib/format';
import { use_t } from '@/lib/i18n';
import type { TenantAdminInfo } from '@/types/tenantmanager';
import './tenant_admin_page.css';

function BindRolesModal({
  admin,
  roles,
  on_close,
  on_saved,
}: {
  admin: TenantAdminInfo | null;
  roles: { label: string; value: string }[];
  on_close: () => void;
  on_saved: () => void;
}) {
  const t = use_t();
  const { message } = App.useApp();
  const [selected, set_selected] = useState<string[]>([]);

  const open = admin != null;
  const current = admin?.role_codes ?? [];

  const on_save = async () => {
    if (admin == null) {
      return;
    }
    try {
      await set_tenant_admin_roles(admin.tenant_admin_code, selected);
      message.success(t('common.saved'));
      on_close();
      on_saved();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <Modal
      title={t('tenant_admin.bind_roles')}
      open={open}
      onCancel={on_close}
      onOk={() => void on_save()}
      destroyOnClose
      afterOpenChange={(visible) => {
        if (visible) {
          set_selected(current);
        }
      }}
    >
      <p className="tenant-admin-page__hint">{t('tenant_admin.bind_roles_hint')}</p>
      <Select
        mode="multiple"
        className="tenant-admin-page__role-select"
        value={selected}
        onChange={set_selected}
        options={roles}
      />
    </Modal>
  );
}

/** 租户管理员（tnu）—— 姓名即登录账号；绑角色全量覆盖；重置密码仅回显一次。 */
export function TenantAdminPage() {
  const t = use_t();
  const { message } = App.useApp();
  const [form_open, set_form_open] = useState(false);
  const [editing, set_editing] = useState<TenantAdminInfo | null>(null);
  const [bind_target, set_bind_target] = useState<TenantAdminInfo | null>(null);
  const [reset_result, set_reset_result] = useState<{ name: string; password: string } | null>(
    null,
  );

  const { data: admins = [], refetch, isLoading } = useQuery({
    queryKey: ['tenant-admin', 'list'],
    queryFn: () =>
      list_tenant_admins({ page: 1, page_size: 500, sort_by: 'created_at', descending: 'desc' }),
    select: (data) => data.list,
    staleTime: 30_000,
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['tenant-role', 'list'],
    queryFn: () =>
      list_tenant_roles({ page: 1, page_size: 500, sort_by: 'created_at', descending: 'desc' }),
    select: (data) => data.list,
    staleTime: 30_000,
  });
  const role_options = roles.map((role) => ({ label: role.name, value: role.tenant_role_code }));

  const on_delete = async (admin: TenantAdminInfo) => {
    try {
      await delete_tenant_admin(admin.tenant_admin_code);
      message.success(t('common.deleted'));
      void refetch();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const on_toggle = async (admin: TenantAdminInfo, status: 'enable' | 'disable') => {
    try {
      await update_tenant_admin_status(admin.tenant_admin_code, status);
      message.success(status === 'disable' ? t('common.disable') : t('common.enable'));
      void refetch();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const on_reset_password = async (admin: TenantAdminInfo) => {
    try {
      const data = await reset_tenant_admin_password(admin.tenant_admin_code);
      set_reset_result({ name: admin.name, password: data.new_password });
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const columns: ProColumns<TenantAdminInfo>[] = [
    { title: t('tenant_admin.name'), dataIndex: 'name' },
    {
      title: t('tenant_admin.code'),
      dataIndex: 'tenant_admin_code',
      render: (_, record) => <Tag>{record.tenant_admin_code}</Tag>,
    },
    { title: t('tenant_admin.email'), dataIndex: 'email', ellipsis: true },
    { title: t('tenant_admin.phone'), dataIndex: 'phone', width: 140 },
    {
      title: t('tenant_admin.roles'),
      dataIndex: 'role_names',
      render: (_, record) =>
        record.role_names.length === 0
          ? '—'
          : record.role_names.map((name) => <Tag key={name}>{name}</Tag>),
    },
    {
      title: t('tenant_admin.status'),
      dataIndex: 'status',
      width: 90,
      render: (_, record) => (
        <Tag color={record.status === 'enable' ? 'green' : 'default'}>
          {record.status === 'enable' ? t('common.enable') : t('common.disable')}
        </Tag>
      ),
    },
    {
      title: t('tenant_admin.is_locked'),
      dataIndex: 'is_locked',
      width: 90,
      render: (_, record) =>
        record.is_locked ? <Tag color="red">{t('tenant_admin.locked')}</Tag> : '—',
    },
    {
      title: t('tenant_admin.must_change_password'),
      dataIndex: 'must_change_password',
      width: 120,
      render: (_, record) => (record.must_change_password ? <Tag color="orange">√</Tag> : '—'),
    },
    {
      title: t('tenant_admin.last_login_at'),
      dataIndex: 'last_login_at',
      width: 170,
      render: (_, record) => format_unix_time(record.last_login_at),
    },
    {
      title: t('common.actions'),
      valueType: 'option',
      width: 320,
      render: (_, record) => (
        <Space size={4}>
          <a
            onClick={() => {
              set_editing(record);
              set_form_open(true);
            }}
          >
            {t('tenant_admin.edit')}
          </a>
          <a onClick={() => set_bind_target(record)}>
            <SafetyCertificateOutlined /> {t('tenant_admin.bind_roles')}
          </a>
          <Popconfirm
            title={t('tenant_admin.reset_confirm')}
            onConfirm={() => on_reset_password(record)}
          >
            <a>
              <KeyOutlined /> {t('tenant_admin.reset_password')}
            </a>
          </Popconfirm>
          {record.status === 'enable' ? (
            <Popconfirm
              title={t('tenant_admin.disable_confirm')}
              onConfirm={() => on_toggle(record, 'disable')}
            >
              <a>{t('common.disable')}</a>
            </Popconfirm>
          ) : (
            <Popconfirm
              title={t('tenant_admin.enable_confirm')}
              onConfirm={() => on_toggle(record, 'enable')}
            >
              <a>{t('common.enable')}</a>
            </Popconfirm>
          )}
          <Popconfirm title={t('tenant_admin.delete_confirm')} onConfirm={() => on_delete(record)}>
            <a className="tenant-admin-page__danger">{t('common.delete')}</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="tenant-admin-page">
      <ProTable<TenantAdminInfo>
        rowKey="tenant_admin_code"
        columns={columns}
        dataSource={admins}
        loading={isLoading}
        search={false}
        pagination={false}
        options={false}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              set_editing(null);
              set_form_open(true);
            }}
          >
            {t('tenant_admin.create')}
          </Button>,
        ]}
      />

      <TenantAdminForm
        open={form_open}
        editing={editing}
        on_close={set_form_open}
        on_saved={() => void refetch()}
      />
      <BindRolesModal
        admin={bind_target}
        roles={role_options}
        on_close={() => set_bind_target(null)}
        on_saved={() => void refetch()}
      />
      <Modal
        title={t('tenant_admin.reset_password')}
        open={reset_result != null}
        onCancel={() => set_reset_result(null)}
        footer={null}
        width={420}
      >
        <p>{reset_result?.name}</p>
        <Typography.Paragraph copyable={{ text: reset_result?.password }}>
          {reset_result?.password}
        </Typography.Paragraph>
        <p className="tenant-admin-page__hint">{t('tenant_admin.new_password_hint')}</p>
      </Modal>
    </div>
  );
}
