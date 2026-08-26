import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { App, Button, Popconfirm, Space, Tag } from 'antd';
import { useState } from 'react';
import { delete_user } from '@/api/user';
import { MemberDetails } from '@/features/member/member_details';
import { MemberForm } from '@/features/member/member_form';
import { use_user_list } from '@/hooks/queries/use_user_list';
import { use_t } from '@/lib/i18n';
import type { UserInfo } from '@/types/identityhub';
import './user_table.css';

interface UserTableProps {
  domain: string;
  org_id: string | null;
}

/** 成员表格 —— 数据源 = use_user_list（Mock）。详情/增删改走真实网关。 */
export function UserTable({ domain, org_id }: UserTableProps) {
  const t = use_t();
  const { message } = App.useApp();
  const { data: users = [], refetch, isLoading } = use_user_list(domain, org_id);
  const [form_open, set_form_open] = useState(false);
  const [editing, set_editing] = useState<UserInfo | null>(null);
  const [detail_id, set_detail_id] = useState<string | null>(null);

  const on_delete = async (user: UserInfo) => {
    try {
      await delete_user(user.id, domain);
      message.success(t('common.deleted'));
      void refetch();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const columns: ProColumns<UserInfo>[] = [
    { title: t('member.display_name'), dataIndex: 'display_name' },
    { title: t('member.username'), dataIndex: 'username' },
    { title: t('member.phone'), dataIndex: 'phone', width: 140 },
    { title: t('member.email'), dataIndex: 'email', ellipsis: true },
    {
      title: t('member.status'),
      dataIndex: 'status',
      width: 100,
      render: (_, record) => (
        <Tag color={record.status === 'enable' ? 'green' : 'default'}>{record.status}</Tag>
      ),
    },
    {
      title: t('common.actions'),
      valueType: 'option',
      width: 180,
      render: (_, record) => (
        <Space size={4}>
          <a onClick={() => set_detail_id(record.id)}>{t('member.detail')}</a>
          <a
            onClick={() => {
              set_editing(record);
              set_form_open(true);
            }}
          >
            {t('member.edit')}
          </a>
          <Popconfirm title={t('member.delete_confirm')} onConfirm={() => on_delete(record)}>
            <a className="user-table__danger">{t('common.delete')}</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-table">
      <ProTable<UserInfo>
        rowKey="id"
        columns={columns}
        dataSource={users}
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
            {t('member.create')}
          </Button>,
        ]}
      />

      <MemberForm
        domain={domain}
        open={form_open}
        editing={editing}
        on_close={set_form_open}
        on_saved={() => void refetch()}
      />
      <MemberDetails user_id={detail_id} domain={domain} on_close={() => set_detail_id(null)} />
    </div>
  );
}
