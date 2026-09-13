import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { App, Button, Input, Popconfirm, Space, Tag } from 'antd';
import { useState } from 'react';
import { delete_user, update_user_status } from '@/api/user';
import { MemberDetails } from '@/features/member/member_details';
import { MemberForm } from '@/features/member/member_form';
import { use_user_list } from '@/hooks/queries/use_user_list';
import { use_t } from '@/lib/i18n';
import type { UserInfo } from '@/types/identityhub';
import './user_table.css';

interface UserTableProps {
  directory_code: string;
  organization_code: string | null;
}

/** 成员表格 —— 数据源 = use_user_list。source != local 的用户只能停用、不可删除。 */
export function UserTable({ directory_code, organization_code }: UserTableProps) {
  const t = use_t();
  const { message } = App.useApp();
  const [keyword, set_keyword] = useState('');
  const { data: users = [], refetch, isLoading } = use_user_list(directory_code, organization_code, keyword);
  const [form_open, set_form_open] = useState(false);
  const [editing, set_editing] = useState<UserInfo | null>(null);
  const [detail_code, set_detail_code] = useState<string | null>(null);

  const on_delete = async (user: UserInfo) => {
    try {
      await delete_user(user.user_code);
      message.success(t('common.deleted'));
      void refetch();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const on_toggle = async (user: UserInfo, status: 'enable' | 'disable') => {
    try {
      await update_user_status(user.user_code, status);
      message.success(status === 'disable' ? t('common.disable') : t('common.enable'));
      void refetch();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const columns: ProColumns<UserInfo>[] = [
    { title: t('member.name'), dataIndex: 'name' },
    { title: t('member.phone'), dataIndex: 'phone', width: 140 },
    { title: t('member.email'), dataIndex: 'email', ellipsis: true },
    {
      title: t('member.source'),
      dataIndex: 'source',
      width: 90,
      render: (_, record) => <Tag>{record.source}</Tag>,
    },
    {
      title: t('member.status'),
      dataIndex: 'status',
      width: 100,
      render: (_, record) => (
        <Tag color={record.status === 'enable' ? 'green' : 'default'}>
          {record.status === 'enable' ? t('common.enable') : t('common.disable')}
        </Tag>
      ),
    },
    {
      title: t('common.actions'),
      valueType: 'option',
      width: 220,
      render: (_, record) => {
        const is_local = record.source === 'local';
        return (
          <Space size={4}>
            <a onClick={() => set_detail_code(record.user_code)}>{t('member.detail')}</a>
            <a
              onClick={() => {
                set_editing(record);
                set_form_open(true);
              }}
            >
              {t('member.edit')}
            </a>
            {record.status === 'enable' ? (
              <Popconfirm title={t('member.disable_confirm')} onConfirm={() => on_toggle(record, 'disable')}>
                <a>{t('common.disable')}</a>
              </Popconfirm>
            ) : (
              <Popconfirm title={t('member.enable_confirm')} onConfirm={() => on_toggle(record, 'enable')}>
                <a>{t('common.enable')}</a>
              </Popconfirm>
            )}
            {is_local ? (
              <Popconfirm title={t('member.delete_confirm')} onConfirm={() => on_delete(record)}>
                <a className="user-table__danger">{t('common.delete')}</a>
              </Popconfirm>
            ) : null}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="user-table">
      <ProTable<UserInfo>
        rowKey="user_code"
        columns={columns}
        dataSource={users}
        loading={isLoading}
        search={false}
        pagination={false}
        options={false}
        toolBarRender={() => [
          <Input.Search
            key="search"
            placeholder={t('member.search')}
            allowClear
            onSearch={(value) => set_keyword(value.trim())}
            onChange={(event) => {
              if (event.target.value === '') {
                set_keyword('');
              }
            }}
            style={{ width: 240 }}
          />,
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
        directory_code={directory_code}
        open={form_open}
        editing={editing}
        on_close={set_form_open}
        on_saved={() => void refetch()}
      />
      <MemberDetails user_code={detail_code} on_close={() => set_detail_code(null)} />
    </div>
  );
}
