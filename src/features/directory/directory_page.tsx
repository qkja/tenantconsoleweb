import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { App, Button, Popconfirm, Space, Tag } from 'antd';
import { useState } from 'react';
import { create_directory, delete_directory, update_directory } from '@/api/directory';
import { use_directory_list } from '@/hooks/queries/use_directory_list';
import { format_unix_time } from '@/lib/format';
import { use_t } from '@/lib/i18n';
import type { DirectoryInfo, DirectoryType } from '@/types/identityhub';
import './directory_page.css';

interface DirectoryFormValues {
  name: string;
  type: DirectoryType;
  description?: string;
}

const TYPE_OPTIONS = [
  { value: 'local', label: 'local' },
  { value: 'ad', label: 'ad' },
  { value: 'ldap', label: 'ldap' },
];

/** 目录域管理 —— 租户内的用户源分区。type 创建后不可变。 */
export function DirectoryPage() {
  const t = use_t();
  const { message } = App.useApp();
  const { data: directories = [], refetch, isLoading } = use_directory_list();
  const [editing, set_editing] = useState<DirectoryInfo | null>(null);
  const [form_open, set_form_open] = useState(false);

  const on_delete = async (directory_code: string) => {
    try {
      await delete_directory(directory_code);
      message.success(t('common.deleted'));
      void refetch();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const on_submit = async (values: DirectoryFormValues) => {
    try {
      if (editing != null) {
        await update_directory(editing.directory_code, {
          name: values.name,
          description: values.description,
        });
      } else {
        await create_directory({ name: values.name, type: values.type, description: values.description });
      }
      message.success(t('common.saved'));
      set_form_open(false);
      set_editing(null);
      void refetch();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const columns: ProColumns<DirectoryInfo>[] = [
    { title: t('directory.name'), dataIndex: 'name' },
    {
      title: t('directory.type'),
      dataIndex: 'type',
      width: 90,
      render: (_, record) => <Tag>{record.type}</Tag>,
    },
    { title: t('directory.description'), dataIndex: 'description', ellipsis: true },
    {
      title: t('directory.status'),
      dataIndex: 'status',
      width: 90,
      render: (_, record) => (
        <Tag color={record.status === 'enable' ? 'green' : 'default'}>
          {record.status === 'enable' ? t('common.enable') : t('common.disable')}
        </Tag>
      ),
    },
    {
      title: t('directory.created_at'),
      dataIndex: 'created_at',
      width: 180,
      render: (_, record) => format_unix_time(record.created_at),
    },
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
            {t('directory.edit')}
          </a>
          <Popconfirm
            title={t('directory.delete_confirm')}
            onConfirm={() => on_delete(record.directory_code)}
          >
            <a className="directory-page__danger">{t('common.delete')}</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="directory-page">
      <ProTable<DirectoryInfo>
        rowKey="directory_code"
        columns={columns}
        dataSource={directories}
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
            {t('directory.create')}
          </Button>,
        ]}
      />

      <ModalForm<DirectoryFormValues>
        title={editing != null ? t('directory.edit') : t('directory.create')}
        open={form_open}
        onOpenChange={set_form_open}
        initialValues={editing ?? { name: '', type: 'local', description: '' }}
        modalProps={{ destroyOnClose: true }}
        onFinish={async (values) => {
          await on_submit(values);
          return true;
        }}
      >
        <ProFormText
          name="name"
          label={t('directory.name')}
          rules={[{ required: true, message: t('directory.name_required') }]}
        />
        <ProFormSelect
          name="type"
          label={t('directory.type')}
          disabled={editing != null}
          options={TYPE_OPTIONS}
          rules={[{ required: true, message: t('directory.type_required') }]}
          extra={editing != null ? t('directory.type_immutable') : undefined}
        />
        <ProFormText name="description" label={t('directory.description')} />
      </ModalForm>
    </div>
  );
}
