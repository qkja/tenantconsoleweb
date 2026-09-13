import {
  ModalForm,
  ProFormCheckbox,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { App, Form, TreeSelect } from 'antd';
import { useMemo, type Key } from 'react';
import { list_organization_children } from '@/api/organization';
import { create_tenant_role, update_tenant_role } from '@/api/tenant_role';
import { use_directory_list } from '@/hooks/queries/use_directory_list';
import { use_organization_children } from '@/hooks/queries/use_organization_children';
import { use_t } from '@/lib/i18n';
import { TENANT_PAGE_CODES } from '@/lib/page_codes';
import { use_scope } from '@/stores/scope';
import type { TenantRoleInfo } from '@/types/tenantmanager';

interface TenantRoleFormProps {
  open: boolean;
  editing: TenantRoleInfo | null;
  on_close: (open: boolean) => void;
  on_saved: () => void;
}

interface TenantRoleFormValues {
  name: string;
  description?: string;
  page_codes?: string[];
  scope_organization_codes?: string[];
  scope_directory_codes?: string[];
}

/** 组织架构数据范围选择 —— 根节点走 query，深层子级展开时按 parent_code 懒加载。 */
function OrgScopeSelect({ directory_code }: { directory_code: string }) {
  const { data: roots = [] } = use_organization_children(directory_code, null);
  const tree_data = useMemo(
    () => roots.map((org) => ({ value: org.organization_code, title: org.name })),
    [roots],
  );

  const on_load = async (node: { value?: Key; children?: unknown[] }): Promise<void> => {
    const data = await list_organization_children({
      directory_code,
      parent_code: String(node.value),
      page: 1,
      page_size: 500,
    });
    node.children = data.list.map((org) => ({ value: org.organization_code, title: org.name }));
  };

  return (
    <TreeSelect
      treeData={tree_data}
      treeCheckable
      multiple
      showCheckedStrategy={TreeSelect.SHOW_PARENT}
      loadData={on_load}
    />
  );
}

/** 租户管理角色新增/编辑表单 —— 页面权限 + 双轴数据范围（组织架构 / 目录域）。 */
export function TenantRoleForm({ open, editing, on_close, on_saved }: TenantRoleFormProps) {
  const t = use_t();
  const { message } = App.useApp();
  const { directory_code } = use_scope();
  const { data: directories = [] } = use_directory_list();
  const dir_code = directory_code ?? directories[0]?.directory_code ?? '';

  const page_options = TENANT_PAGE_CODES.map((item) => ({
    label: t(item.label_key),
    value: item.code,
  }));
  const directory_options = directories.map((dir) => ({
    label: dir.name,
    value: dir.directory_code,
  }));

  const on_submit = async (values: TenantRoleFormValues) => {
    try {
      if (editing != null) {
        await update_tenant_role(editing.tenant_role_code, {
          name: values.name,
          description: values.description,
          page_codes: values.page_codes ?? [],
          scope_organization_codes: values.scope_organization_codes ?? [],
          scope_directory_codes: values.scope_directory_codes ?? [],
        });
      } else {
        await create_tenant_role({
          name: values.name,
          description: values.description,
          page_codes: values.page_codes ?? [],
          scope_organization_codes: values.scope_organization_codes ?? [],
          scope_directory_codes: values.scope_directory_codes ?? [],
        });
      }
      message.success(t('common.saved'));
      on_close(false);
      on_saved();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <ModalForm<TenantRoleFormValues>
      title={editing != null ? t('tenant_role.edit') : t('tenant_role.create')}
      open={open}
      onOpenChange={on_close}
      initialValues={
        editing != null
          ? {
              name: editing.name,
              description: editing.description,
              page_codes: editing.page_codes,
              scope_organization_codes: editing.scope_organization_codes,
              scope_directory_codes: editing.scope_directory_codes,
            }
          : { name: '', description: '', page_codes: [], scope_organization_codes: [], scope_directory_codes: [] }
      }
      modalProps={{ destroyOnClose: true }}
      onFinish={async (values) => {
        const org_codes = values.scope_organization_codes ?? [];
        const dir_codes = values.scope_directory_codes ?? [];
        // 自定义角色必须至少选一个数据范围（两空 = 不限，那是内置超级管理员的特权）。
        if (org_codes.length === 0 && dir_codes.length === 0) {
          message.error(t('tenant_role.scope_required'));
          return false;
        }
        await on_submit(values);
        return true;
      }}
    >
      <ProFormText
        name="name"
        label={t('tenant_role.name')}
        rules={[{ required: true, message: t('tenant_role.name_required') }]}
      />
      <ProFormTextArea name="description" label={t('tenant_role.description')} />
      <ProFormCheckbox.Group
        name="page_codes"
        label={t('tenant_role.page_codes')}
        options={page_options}
      />
      <Form.Item
        name="scope_organization_codes"
        label={t('tenant_role.scope_organization')}
        extra={t('tenant_role.scope_descendants_hint')}
      >
        <OrgScopeSelect directory_code={dir_code} />
      </Form.Item>
      <ProFormSelect
        name="scope_directory_codes"
        label={t('tenant_role.scope_directory')}
        mode="multiple"
        options={directory_options}
        allowClear
      />
    </ModalForm>
  );
}
