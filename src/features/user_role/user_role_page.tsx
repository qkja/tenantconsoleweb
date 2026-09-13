import { PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, Modal, Popconfirm, Select, Space, Table, Tag } from 'antd';
import { useState } from 'react';
import { list_users } from '@/api/user';
import {
  add_user_role_members,
  create_user_role,
  delete_user_role,
  list_user_role_members,
  list_user_roles,
  remove_user_role_members,
  update_user_role,
} from '@/api/user_role';
import { use_directory_list } from '@/hooks/queries/use_directory_list';
import { format_unix_time } from '@/lib/format';
import { use_t } from '@/lib/i18n';
import { use_scope } from '@/stores/scope';
import type { UserRoleInfo, UserRoleMemberInfo } from '@/types/identityhub';
import './user_role_page.css';

interface UserRoleFormValues {
  name: string;
  description?: string;
}

/** 用户角色成员管理弹窗 —— 成员须与角色同目录域。 */
function MembersModal({ role, on_close }: { role: UserRoleInfo | null; on_close: () => void }) {
  const t = use_t();
  const { message } = App.useApp();
  const [selected, set_selected] = useState<string[]>([]);

  const { data: members = [], refetch, isLoading } = useQuery({
    queryKey: ['user-role', 'members', role?.user_role_code],
    queryFn: () =>
      list_user_role_members({
        user_role_code: role?.user_role_code ?? '',
        page: 1,
        page_size: 500,
        sort_by: 'created_at',
        descending: 'desc',
      }),
    enabled: role != null,
    select: (data) => data.list,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['user-role', 'candidates', role?.directory_code],
    queryFn: () =>
      list_users({
        directory_code: role?.directory_code,
        page: 1,
        page_size: 500,
        sort_by: 'created_at',
        descending: 'desc',
      }),
    enabled: role != null,
    select: (data) => data.list,
  });

  const member_codes = new Set(members.map((member) => member.user_code));
  const candidates = users.filter((user) => !member_codes.has(user.user_code));

  const on_add = async () => {
    if (role == null || selected.length === 0) {
      return;
    }
    try {
      await add_user_role_members(role.user_role_code, selected);
      message.success(t('common.saved'));
      set_selected([]);
      void refetch();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const on_remove = async (member: UserRoleMemberInfo) => {
    if (role == null) {
      return;
    }
    try {
      await remove_user_role_members(role.user_role_code, [member.user_code]);
      message.success(t('common.deleted'));
      void refetch();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <Modal
      title={t('user_role.members')}
      open={role != null}
      onCancel={on_close}
      footer={null}
      width={560}
    >
      <div className="user-role-page__add-row">
        <Select
          mode="multiple"
          className="user-role-page__select"
          placeholder={t('user_role.select_members')}
          value={selected}
          onChange={set_selected}
          options={candidates.map((user) => ({ label: user.name, value: user.user_code }))}
        />
        <Button type="primary" onClick={() => void on_add()} disabled={selected.length === 0}>
          {t('user_role.add_members')}
        </Button>
      </div>
      <Table<UserRoleMemberInfo>
        rowKey="user_code"
        size="small"
        loading={isLoading}
        dataSource={members}
        pagination={false}
        columns={[
          { title: t('member.name'), dataIndex: 'name' },
          { title: t('directory.code'), dataIndex: 'user_code' },
          {
            title: t('common.actions'),
            render: (_, record) => (
              <Popconfirm
                title={t('user_role.remove_confirm')}
                onConfirm={() => void on_remove(record)}
              >
                <a className="user-role-page__danger">{t('user_role.remove')}</a>
              </Popconfirm>
            ),
          },
        ]}
      />
    </Modal>
  );
}

/** 用户角色管理（原「安全组」）—— 挂在目录域下的用户标签，不带权限点。 */
export function UserRolePage() {
  const t = use_t();
  const { message } = App.useApp();
  const query_client = useQueryClient();
  const { directory_code } = use_scope();
  const { data: directories = [] } = use_directory_list();
  const dir_code = directory_code ?? directories[0]?.directory_code ?? '';

  const [editing, set_editing] = useState<UserRoleInfo | null>(null);
  const [form_open, set_form_open] = useState(false);
  const [members_role, set_members_role] = useState<UserRoleInfo | null>(null);

  const { data: roles = [], refetch, isLoading } = useQuery({
    queryKey: ['user-role', 'list', dir_code],
    queryFn: () =>
      list_user_roles({
        directory_code: dir_code,
        page: 1,
        page_size: 500,
        sort_by: 'created_at',
        descending: 'desc',
      }),
    enabled: dir_code !== '',
    select: (data) => data.list,
    staleTime: 30_000,
  });

  const on_delete = async (role: UserRoleInfo) => {
    try {
      await delete_user_role(role.user_role_code);
      message.success(t('common.deleted'));
      void refetch();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const on_submit = async (values: UserRoleFormValues) => {
    try {
      if (editing != null) {
        await update_user_role(editing.user_role_code, {
          name: values.name,
          description: values.description,
        });
      } else {
        await create_user_role({ directory_code: dir_code, ...values });
      }
      message.success(t('common.saved'));
      set_form_open(false);
      set_editing(null);
      void refetch();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const columns: ProColumns<UserRoleInfo>[] = [
    { title: t('user_role.name'), dataIndex: 'name' },
    {
      title: t('user_role.code'),
      dataIndex: 'user_role_code',
      render: (_, record) => <Tag>{record.user_role_code}</Tag>,
    },
    { title: t('user_role.description'), dataIndex: 'description', ellipsis: true },
    {
      title: t('directory.created_at'),
      dataIndex: 'created_at',
      width: 180,
      render: (_, record) => format_unix_time(record.created_at),
    },
    {
      title: t('common.actions'),
      valueType: 'option',
      width: 220,
      render: (_, record) => (
        <Space size={4}>
          <a onClick={() => set_members_role(record)}>
            <TeamOutlined /> {t('user_role.members')}
          </a>
          <a
            onClick={() => {
              set_editing(record);
              set_form_open(true);
            }}
          >
            {t('user_role.edit')}
          </a>
          <Popconfirm title={t('user_role.delete_confirm')} onConfirm={() => on_delete(record)}>
            <a className="user-role-page__danger">{t('common.delete')}</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-role-page">
      <ProTable<UserRoleInfo>
        rowKey="user_role_code"
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
            {t('user_role.create')}
          </Button>,
        ]}
      />

      <ModalForm<UserRoleFormValues>
        title={editing != null ? t('user_role.edit') : t('user_role.create')}
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
          label={t('user_role.name')}
          rules={[{ required: true, message: t('user_role.name_required') }]}
        />
        <ProFormText name="description" label={t('user_role.description')} />
      </ModalForm>

      <MembersModal role={members_role} on_close={() => {
        set_members_role(null);
        void query_client.invalidateQueries({ queryKey: ['user-role', 'members'] });
      }} />
    </div>
  );
}
