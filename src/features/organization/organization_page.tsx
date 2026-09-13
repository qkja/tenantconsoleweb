import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { App, Button, Card, Descriptions, Empty, Popconfirm, Space } from 'antd';
import { useState } from 'react';
import { create_organization, delete_organization, update_organization } from '@/api/organization';
import { OrgTree } from '@/components/org_tree/org_tree';
import { use_directory_list } from '@/hooks/queries/use_directory_list';
import { format_unix_time } from '@/lib/format';
import { use_t } from '@/lib/i18n';
import { use_scope } from '@/stores/scope';
import type { OrganizationInfo } from '@/types/identityhub';
import './organization_page.css';

interface OrgFormValues {
  name: string;
  description?: string;
}

type CreateParent = OrganizationInfo | 'root' | null;

/** 组织架构 —— 企微通讯录双栏：左组织树 + 右部门详情。 */
export function OrganizationPage() {
  const t = use_t();
  const { message } = App.useApp();
  const { directory_code } = use_scope();
  const { data: directories = [] } = use_directory_list();

  const [selected, set_selected] = useState<OrganizationInfo | null>(null);
  const [form_open, set_form_open] = useState(false);
  const [editing, set_editing] = useState<OrganizationInfo | null>(null);
  const [create_parent, set_create_parent] = useState<CreateParent>(null);

  const dir_code = directory_code ?? directories[0]?.directory_code ?? '';

  const open_create = (parent: CreateParent) => {
    set_editing(null);
    set_create_parent(parent);
    set_form_open(true);
  };

  const open_edit = (node: OrganizationInfo) => {
    set_editing(node);
    set_create_parent(null);
    set_form_open(true);
  };

  const on_delete = async (node: OrganizationInfo) => {
    try {
      await delete_organization(node.organization_code, dir_code);
      message.success(t('common.deleted'));
      set_selected(null);
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const on_submit = async (values: OrgFormValues) => {
    try {
      if (editing != null) {
        await update_organization(editing.organization_code, dir_code, {
          name: values.name,
          description: values.description,
        });
      } else {
        await create_organization({
          directory_code: dir_code,
          parent_code:
            create_parent === 'root' || create_parent == null
              ? undefined
              : create_parent.organization_code,
          name: values.name,
          description: values.description,
        });
      }
      message.success(t('common.saved'));
      set_form_open(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const form_title =
    editing != null
      ? t('organization.edit')
      : create_parent == null || create_parent === 'root'
        ? t('organization.create_root')
        : t('organization.create_child');

  return (
    <div className="organization-page">
      <Card className="organization-page__tree-card" title={t('organization.title')}>
        <OrgTree
          directory_code={dir_code}
          selected_id={selected?.organization_code ?? null}
          on_select={set_selected}
        />
      </Card>

      <Card
        className="organization-page__detail-card"
        title={t('organization.title')}
        extra={
          selected != null ? (
            <Space>
              <Button size="small" icon={<PlusOutlined />} onClick={() => open_create(selected)}>
                {t('organization.create_child')}
              </Button>
              <Button size="small" onClick={() => open_edit(selected)}>
                {t('organization.edit')}
              </Button>
              <Popconfirm
                title={t('organization.delete_confirm')}
                onConfirm={() => on_delete(selected)}
              >
                <Button size="small" danger>
                  {t('common.delete')}
                </Button>
              </Popconfirm>
            </Space>
          ) : null
        }
      >
        {selected == null ? (
          <Empty
            description={t('organization.no_selection')}
            className="organization-page__empty"
          />
        ) : (
          <Descriptions
            column={1}
            size="small"
            items={[
              { key: 'name', label: t('directory.name'), children: selected.name },
              {
                key: 'parent',
                label: t('organization.parent'),
                children: selected.parent_code || '—',
              },
              { key: 'directory', label: t('directory.code'), children: selected.directory_code },
              { key: 'path', label: t('organization.path'), children: selected.path || '—' },
              { key: 'level', label: t('organization.level'), children: selected.level },
              {
                key: 'created',
                label: t('directory.created_at'),
                children: format_unix_time(selected.created_at),
              },
            ]}
          />
        )}
      </Card>

      <ModalForm<OrgFormValues>
        title={form_title}
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
          label={t('directory.name')}
          rules={[{ required: true, message: t('directory.name_required') }]}
        />
        <ProFormText name="description" label={t('directory.description')} />
      </ModalForm>
    </div>
  );
}
