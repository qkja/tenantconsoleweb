import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Alert, App } from 'antd';
import { create_user, update_user } from '@/api/user';
import { use_organization_children } from '@/hooks/queries/use_organization_children';
import { use_t } from '@/lib/i18n';
import type { UserInfo } from '@/types/identityhub';
import './member_form.css';

interface MemberFormProps {
  directory_code: string;
  open: boolean;
  editing: UserInfo | null;
  on_close: (open: boolean) => void;
  on_saved: () => void;
}

interface MemberFormValues {
  name: string;
  email?: string;
  country_code?: string;
  phone?: string;
  description?: string;
  organization_code?: string;
  status: 'enable' | 'disable';
  password?: string;
}

/** 成员新增/编辑表单。source != local 时身份字段只读（须到第三方源修改）。 */
export function MemberForm({ directory_code, open, editing, on_close, on_saved }: MemberFormProps) {
  const t = use_t();
  const { message } = App.useApp();
  const { data: root_orgs = [] } = use_organization_children(directory_code, null);

  const is_external = editing != null && editing.source !== 'local';
  const org_options = root_orgs.map((org) => ({ label: org.name, value: org.organization_code }));

  const on_submit = async (values: MemberFormValues) => {
    try {
      if (editing != null) {
        const payload = is_external
          ? { description: values.description }
          : {
              name: values.name,
              email: values.email,
              country_code: values.country_code,
              phone: values.phone,
              description: values.description,
              organization_code: values.organization_code,
            };
        await update_user(editing.user_code, payload);
      } else {
        await create_user({
          directory_code,
          organization_code: values.organization_code,
          name: values.name,
          email: values.email,
          country_code: values.country_code,
          phone: values.phone,
          description: values.description,
          status: values.status,
          password: values.password ?? '',
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
        editing != null
          ? {
              name: editing.name,
              email: editing.email,
              country_code: editing.country_code,
              phone: editing.phone,
              description: editing.description,
              organization_code: editing.organization_code || undefined,
              status: editing.status,
            }
          : {
              name: '',
              email: '',
              country_code: '',
              phone: '',
              description: '',
              organization_code: undefined,
              status: 'enable',
              password: '',
            }
      }
      modalProps={{ destroyOnClose: true }}
      onFinish={async (values) => {
        await on_submit(values);
        return true;
      }}
    >
      {is_external ? <Alert type="info" showIcon message={t('member.external_hint')} /> : null}
      <ProFormText
        name="name"
        label={t('member.name')}
        disabled={is_external}
        rules={[{ required: !is_external, message: t('member.name_required') }]}
      />
      <ProFormText name="country_code" label={t('member.country_code')} disabled={is_external} />
      <ProFormText name="phone" label={t('member.phone')} disabled={is_external} />
      <ProFormText
        name="email"
        label={t('member.email')}
        disabled={is_external}
        rules={[{ type: 'email', message: t('common.email_invalid') }]}
      />
      <ProFormTextArea name="description" label={t('member.description')} />
      <ProFormSelect
        name="organization_code"
        label={t('member.organization')}
        disabled={is_external}
        options={org_options}
        allowClear
      />
      {editing == null ? (
        <>
          <ProFormText
            name="password"
            label={t('member.password')}
            fieldProps={{ type: 'password' }}
            rules={[{ required: true, message: t('member.password_required') }]}
          />
          <ProFormSelect
            name="status"
            label={t('member.status')}
            options={[
              { value: 'enable', label: t('common.enable') },
              { value: 'disable', label: t('common.disable') },
            ]}
          />
        </>
      ) : null}
    </ModalForm>
  );
}
