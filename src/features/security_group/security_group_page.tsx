import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { App, Button, Popconfirm, Space, Tag } from 'antd';
import { useState } from 'react';
import {
  create_security_group,
  delete_security_group,
  update_security_group,
} from '@/api/security_group';
import { use_directory_list } from '@/hooks/queries/use_directory_list';
import { use_scope } from '@/stores/scope';
import type { SecurityGroupInfo } from '@/types/identityhub';
import { use_t } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { list_security_groups } from '@/api/security_group';
import './security_group_page.css';

interface SecurityGroupFormValues {
  name: string;
  description?: string;
}

/** 安全组管理 —— 列表 Mock（后端缺失），get/create/update/delete 走真实网关。 */
export function SecurityGroupPage() {
  const t = use_t();
  const { message } = App.useApp();
  const { directory_domain } = use_scope();
  const { data: directories = [] } = use_directory_list();
  const [editing, set_editing] = useState<SecurityGroupInfo | null>(null);
  const [form_open, set_form_open] = useState(false);

  const domain = directory_domain ?? directories[0]?.domain ?? '';

  const {
    data: groups = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['security-group', 'list', domain],
    queryFn: () => list_security_groups({ domain }),
    enabled: domain !== '',
    select: (data) => data.list as SecurityGroupInfo[],
    staleTime: 30_000,
  });

  const on_delete = async (group: SecurityGroupInfo) => {
    try {
      await delete_security_group(group.id, domain);
      message.success(t('common.deleted'));
      void refetch();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const on_submit = async (values: SecurityGroupFormValues) => {
    try {
      if (editing != null) {
        await update_security_group(editing.id, domain, {
          name: values.name,
          description: values.description,
        });
      } else {
        await create_security_group({ domain, ...values });
      }
      message.success(t('common.saved'));
      set_form_open(false);
      set_editing(null);
      void refetch();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const columns: ProColumns<SecurityGroupInfo>[] = [
    { title: t('security_group.name'), dataIndex: 'name' },
    {
      title: t('security_group.code'),
      dataIndex: 'code',
      render: (_, record) => <Tag>{record.code}</Tag>,
    },
    { title: t('security_group.description'), dataIndex: 'description', ellipsis: true },
    { title: t('directory.created_at'), dataIndex: 'created_at', width: 180 },
    {
      title: t('common.actions'),
      valueType: 'option',
      width: 150,
      render: (_, record) => (
        <Space size={4}>
          <a
            onClick={() => {
              set_editing(record);
              set_form_open(true);
            }}
          >
            {t('security_group.edit')}
          </a>
          <Popconfirm
            title={t('security_group.delete_confirm')}
            onConfirm={() => on_delete(record)}
          >
            <a className="security-group-page__danger">{t('common.delete')}</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="security-group-page">
      <ProTable<SecurityGroupInfo>
        rowKey="id"
        columns={columns}
        dataSource={groups}
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
            {t('security_group.create')}
          </Button>,
        ]}
      />

      <ModalForm<SecurityGroupFormValues>
        title={editing != null ? t('security_group.edit') : t('security_group.create')}
        open={form_open}
        onOpenChange={set_form_open}
        initialValues={editing ?? { name: '', description: '' }}
        modalProps={{ destroyOnClose: true }}
        onFinish={async (values) => {
          await on_submit(values);
          return true;
        }}
      >
        <ProFormText
          name="name"
          label={t('security_group.name')}
          rules={[{ required: true, message: t('security_group.name_required') }]}
        />
        <ProFormText name="description" label={t('security_group.description')} />
      </ModalForm>
    </div>
  );
}
