import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { App } from 'antd';
import { create_user, update_user } from '@/api/user';
import { use_organization_children } from '@/hooks/queries/use_organization_children';
import { use_t } from '@/lib/i18n';
import type { UserInfo } from '@/types/identityhub';
import './member_form.css';

interface MemberFormProps {
  domain: string;
  open: boolean;
  editing: UserInfo | null;
  on_close: (open: boolean) => void;
  on_saved: () => void;
}

interface MemberFormValues {
  display_name: string;
  username: string;
  phone?: string;
  email?: string;
  primary_org_id?: string;
}

/** 成员新增/编辑表单。Update 为全量覆盖，编辑时提交完整字段。 */
export function MemberForm({ domain, open, editing, on_close, on_saved }: MemberFormProps) {
  const t = use_t();
  const { message } = App.useApp();
  const { data: root_orgs = [] } = use_organization_children(domain, null);

  const org_options = root_orgs.map((org) => ({ label: org.name, value: org.id }));

  const on_submit = async (values: MemberFormValues) => {
    try {
      if (editing != null) {
        // Update 全量覆盖：后端 UpdateUser 仅支持邮箱/手机/显示名（primary_org 走 SetPrimaryOrg，暂缺）。
        await update_user(editing.id, domain, {
          display_name: values.display_name,
          phone: values.phone,
          email: values.email,
        });
      } else {
        await create_user({
          domain,
          username: values.username,
          display_name: values.display_name,
          phone: values.phone,
          email: values.email,
          primary_org_id: values.primary_org_id,
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
    <ModalForm<MemberFormValues>
      title={editing != null ? t('member.edit') : t('member.create')}
      open={open}
      onOpenChange={on_close}
      initialValues={
        editing ?? {
          display_name: '',
          username: '',
          phone: '',
          email: '',
          primary_org_id: undefined,
        }
      }
      modalProps={{ destroyOnClose: true }}
      onFinish={async (values) => {
        await on_submit(values);
        return true;
      }}
    >
      <ProFormText
        name="display_name"
        label={t('member.display_name')}
        rules={[{ required: true, message: t('member.display_name_required') }]}
      />
      <ProFormText
        name="username"
        label={t('member.username')}
        disabled={editing != null}
        rules={[{ required: true, message: t('member.username_required') }]}
      />
      <ProFormText name="phone" label={t('member.phone')} />
      <ProFormText
        name="email"
        label={t('member.email')}
        rules={[{ type: 'email', message: t('member.email_invalid') }]}
      />
      <ProFormSelect
        name="primary_org_id"
        label={t('member.primary_org')}
        options={org_options}
        allowClear
      />
    </ModalForm>
  );
}
