import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-form';
import { useQuery } from '@tanstack/react-query';
import { App } from 'antd';
import { create_tenant_admin, update_tenant_admin } from '@/api/tenant_admin';
import { list_tenant_roles } from '@/api/tenant_role';
import { use_t } from '@/lib/i18n';
import type { LockWindowUnit, TenantAdminInfo } from '@/types/tenantmanager';

interface TenantAdminFormProps {
  open: boolean;
  editing: TenantAdminInfo | null;
  on_close: (open: boolean) => void;
  on_saved: () => void;
}

interface TenantAdminFormValues {
  name: string;
  country_code?: string;
  phone?: string;
  email?: string;
  password?: string;
  role_codes?: string[];
  must_change_password?: boolean;
  status?: 'enable' | 'disable';
  max_login_failures?: number;
  login_fail_window?: number;
  login_fail_window_unit?: LockWindowUnit;
  is_locked?: boolean;
}

const WINDOW_UNIT_OPTIONS = [
  { value: 'second', label: 'second' },
  { value: 'minute', label: 'minute' },
  { value: 'hour', label: 'hour' },
  { value: 'day', label: 'day' },
];

/** 租户管理员新增/编辑表单 —— 姓名即登录账号；改密走重置接口，编辑不含密码/角色/状态。 */
export function TenantAdminForm({ open, editing, on_close, on_saved }: TenantAdminFormProps) {
  const t = use_t();
  const { message } = App.useApp();

  const { data: roles = [] } = useQuery({
    queryKey: ['tenant-role', 'list'],
    queryFn: () =>
      list_tenant_roles({ page: 1, page_size: 500, sort_by: 'created_at', descending: 'desc' }),
    select: (data) => data.list,
    staleTime: 30_000,
  });
  const role_options = roles.map((role) => ({ label: role.name, value: role.tenant_role_code }));

  const on_submit = async (values: TenantAdminFormValues) => {
    try {
      if (editing != null) {
        await update_tenant_admin(editing.tenant_admin_code, {
          name: values.name,
          country_code: values.country_code,
          phone: values.phone,
          email: values.email,
          max_login_failures: values.max_login_failures,
          login_fail_window: values.login_fail_window,
          login_fail_window_unit: values.login_fail_window_unit,
          is_locked: values.is_locked,
        });
      } else {
        await create_tenant_admin({
          name: values.name,
          country_code: values.country_code,
          phone: values.phone,
          email: values.email,
          password: values.password ?? '',
          role_codes: values.role_codes ?? [],
          must_change_password: values.must_change_password ?? false,
          status: values.status ?? 'enable',
          max_login_failures: values.max_login_failures,
          login_fail_window: values.login_fail_window,
          login_fail_window_unit: values.login_fail_window_unit,
          is_locked: values.is_locked ?? false,
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
    <ModalForm<TenantAdminFormValues>
      title={editing != null ? t('tenant_admin.edit') : t('tenant_admin.create')}
      open={open}
      onOpenChange={on_close}
      initialValues={
        editing != null
          ? {
              name: editing.name,
              country_code: editing.country_code,
              phone: editing.phone,
              email: editing.email,
              max_login_failures: editing.max_login_failures,
              login_fail_window: editing.login_fail_window,
              login_fail_window_unit: editing.login_fail_window_unit,
              is_locked: editing.is_locked,
            }
          : {
              name: '',
              country_code: '',
              phone: '',
              email: '',
              password: '',
              role_codes: [],
              must_change_password: false,
              status: 'enable',
              max_login_failures: 5,
              login_fail_window: 15,
              login_fail_window_unit: 'minute',
              is_locked: false,
            }
      }
      modalProps={{ destroyOnClose: true }}
      onFinish={async (values) => {
        await on_submit(values);
        return true;
      }}
    >
      <ProFormText
        name="name"
        label={t('tenant_admin.name')}
        rules={[{ required: true, message: t('tenant_admin.name_required') }]}
        extra={t('tenant_admin.name_hint')}
      />
      <ProFormText name="country_code" label={t('tenant_admin.country_code')} />
      <ProFormText name="phone" label={t('tenant_admin.phone')} />
      <ProFormText
        name="email"
        label={t('tenant_admin.email')}
        rules={[{ type: 'email', message: t('common.email_invalid') }]}
      />
      {editing == null ? (
        <>
          <ProFormText
            name="password"
            label={t('tenant_admin.password')}
            fieldProps={{ type: 'password' }}
            rules={[{ required: true, message: t('tenant_admin.password_required') }]}
          />
          <ProFormSelect
            name="role_codes"
            label={t('tenant_admin.roles')}
            mode="multiple"
            options={role_options}
            allowClear
          />
          <ProFormSwitch
            name="must_change_password"
            label={t('tenant_admin.must_change_password')}
          />
          <ProFormSelect
            name="status"
            label={t('tenant_admin.status')}
            options={[
              { value: 'enable', label: t('common.enable') },
              { value: 'disable', label: t('common.disable') },
            ]}
          />
        </>
      ) : null}
      <ProFormDigit
        name="max_login_failures"
        label={t('tenant_admin.max_login_failures')}
        min={0}
        max={100}
      />
      <ProFormDigit
        name="login_fail_window"
        label={t('tenant_admin.login_fail_window')}
        min={0}
        max={9999}
      />
      <ProFormSelect
        name="login_fail_window_unit"
        label={t('tenant_admin.login_fail_window_unit')}
        options={WINDOW_UNIT_OPTIONS}
      />
      <ProFormSwitch name="is_locked" label={t('tenant_admin.is_locked')} />
    </ModalForm>
  );
}
