import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { App, Button, Popconfirm, Space, Tag } from 'antd';
import { useState } from 'react';
import { create_directory, delete_directory, update_directory } from '@/api/directory';
import { use_directory_list } from '@/hooks/queries/use_directory_list';
import { use_t } from '@/lib/i18n';
import type { DirectoryInfo } from '@/types/identityhub';
import './directory_page.css';

interface DirectoryFormValues {
  name: string;
  domain: string;
  description?: string;
}

/** 目录域管理 —— 租户内的通讯录分区。真实网关 :8888。 */
export function DirectoryPage() {
  const t = use_t();
  const { message } = App.useApp();
  const { data: directories = [], refetch, isLoading } = use_directory_list();
  const [editing, set_editing] = useState<DirectoryInfo | null>(null);
  const [form_open, set_form_open] = useState(false);

  const on_delete = async (domain: string) => {
    try {
      await delete_directory(domain);
      message.success(t('common.deleted'));
      void refetch();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const on_submit = async (values: DirectoryFormValues) => {
    try {
      if (editing != null) {
        await update_directory(editing.domain, {
          name: values.name,
          description: values.description,
        });
      } else {
        await create_directory(values);
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
      title: t('directory.domain'),
      dataIndex: 'domain',
      render: (_, record) => <Tag>{record.domain}</Tag>,
    },
    { title: t('directory.description'), dataIndex: 'description', ellipsis: true },
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
            {t('directory.edit')}
          </a>
          <Popconfirm
            title={t('directory.delete_confirm')}
            onConfirm={() => on_delete(record.domain)}
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
        rowKey="id"
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
        initialValues={editing ?? { name: '', domain: '', description: '' }}
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
        <ProFormText
          name="domain"
          label={t('directory.domain')}
          disabled={editing != null}
          rules={[{ required: true, pattern: /^\d{7}$/, message: t('directory.domain_required') }]}
          extra={t('directory.domain_hint')}
        />
        <ProFormText name="description" label={t('directory.description')} />
      </ModalForm>
    </div>
  );
}
