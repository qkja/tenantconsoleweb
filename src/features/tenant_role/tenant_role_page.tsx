import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { useQuery } from '@tanstack/react-query';
import { App, Button, Popconfirm, Space, Tag, Tooltip } from 'antd';
import { useState } from 'react';
import { delete_tenant_role, list_tenant_roles, update_tenant_role_status } from '@/api/tenant_role';
import { TenantRoleForm } from '@/features/tenant_role/tenant_role_form';
import { format_unix_time } from '@/lib/format';
import { use_t } from '@/lib/i18n';
import { tenant_page_label_key } from '@/lib/page_codes';
import type { TenantRoleInfo } from '@/types/tenantmanager';
import './tenant_role_page.css';

function PageCodes({ codes }: { codes: string[] }) {
  const t = use_t();
  if (codes.length === 0) {
    return <span>—</span>;
  }
  return (
    <span>
      {codes.map((code) => {
        const label_key = tenant_page_label_key(code);
        return <Tag key={code}>{label_key != null ? t(label_key) : code}</Tag>;
      })}
    </span>
  );
}

/** 租户管理角色（tro）—— 页面权限 + 双轴数据范围。内置「超级管理员」不可删改停。 */
export function TenantRolePage() {
  const t = use_t();
  const { message } = App.useApp();
  const [form_open, set_form_open] = useState(false);
  const [editing, set_editing] = useState<TenantRoleInfo | null>(null);

  const { data: roles = [], refetch, isLoading } = useQuery({
    queryKey: ['tenant-role', 'list'],
    queryFn: () =>
      list_tenant_roles({ page: 1, page_size: 500, sort_by: 'created_at', descending: 'desc' }),
    select: (data) => data.list,
    staleTime: 30_000,
  });

  const on_delete = async (role: TenantRoleInfo) => {
    try {
      await delete_tenant_role(role.tenant_role_code);
      message.success(t('common.deleted'));
      void refetch();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const on_toggle = async (role: TenantRoleInfo, status: 'enable' | 'disable') => {
    try {
      await update_tenant_role_status(role.tenant_role_code, status);
      message.success(status === 'disable' ? t('common.disable') : t('common.enable'));
      void refetch();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const columns: ProColumns<TenantRoleInfo>[] = [
    { title: t('tenant_role.name'), dataIndex: 'name' },
    {
      title: t('tenant_role.code'),
      dataIndex: 'tenant_role_code',
      render: (_, record) => <Tag>{record.tenant_role_code}</Tag>,
    },
    { title: t('tenant_role.description'), dataIndex: 'description', ellipsis: true },
    {
      title: t('tenant_role.built_in'),
      dataIndex: 'built_in',
      width: 90,
      render: (_, record) => (
        <Tag color={record.built_in ? 'gold' : 'blue'}>
          {record.built_in ? t('tenant_role.built_in_true') : t('tenant_role.built_in_false')}
        </Tag>
      ),
    },
    {
      title: t('tenant_role.status'),
      dataIndex: 'status',
      width: 90,
      render: (_, record) => (
        <Tag color={record.status === 'enable' ? 'green' : 'default'}>
          {record.status === 'enable' ? t('common.enable') : t('common.disable')}
        </Tag>
      ),
    },
    {
      title: t('tenant_role.page_codes'),
      dataIndex: 'page_codes',
      render: (_, record) => <PageCodes codes={record.page_codes} />,
    },
    {
      title: t('tenant_role.scope_organization'),
      dataIndex: 'scope_organization_codes',
      render: (_, record) =>
        record.scope_organization_codes.length === 0
          ? '—'
          : `${record.scope_organization_codes.length}`,
    },
    {
      title: t('tenant_role.scope_directory'),
      dataIndex: 'scope_directory_codes',
      render: (_, record) =>
        record.scope_directory_codes.length === 0 ? '—' : `${record.scope_directory_codes.length}`,
    },
    {
      title: t('tenant_role.created_at'),
      dataIndex: 'created_at',
      width: 180,
      render: (_, record) => format_unix_time(record.created_at),
    },
    {
      title: t('common.actions'),
      valueType: 'option',
      width: 200,
      render: (_, record) => {
        const protected_actions = record.built_in ? (
          <Tooltip title={t('tenant_role.built_in_protected')}>
            <Space size={4}>
              <a className="tenant-role-page__disabled">{t('tenant_role.edit')}</a>
              <a className="tenant-role-page__disabled">{t('common.disable')}</a>
              <a className="tenant-role-page__disabled">{t('common.delete')}</a>
            </Space>
          </Tooltip>
        ) : (
          <Space size={4}>
            <a
              onClick={() => {
                set_editing(record);
                set_form_open(true);
              }}
            >
              {t('tenant_role.edit')}
            </a>
            {record.status === 'enable' ? (
              <Popconfirm
                title={t('tenant_role.disable_confirm')}
                onConfirm={() => on_toggle(record, 'disable')}
              >
                <a>{t('common.disable')}</a>
              </Popconfirm>
            ) : (
              <Popconfirm
                title={t('tenant_role.enable_confirm')}
                onConfirm={() => on_toggle(record, 'enable')}
              >
                <a>{t('common.enable')}</a>
              </Popconfirm>
            )}
            <Popconfirm title={t('tenant_role.delete_confirm')} onConfirm={() => on_delete(record)}>
              <a className="tenant-role-page__danger">{t('common.delete')}</a>
            </Popconfirm>
          </Space>
        );
        return protected_actions;
      },
    },
  ];

  return (
    <div className="tenant-role-page">
      <ProTable<TenantRoleInfo>
        rowKey="tenant_role_code"
        columns={columns}
        dataSource={roles}
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
            {t('tenant_role.create')}
          </Button>,
        ]}
      />

      <TenantRoleForm
        open={form_open}
        editing={editing}
        on_close={set_form_open}
        on_saved={() => void refetch()}
      />
    </div>
  );
}
