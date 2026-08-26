import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '@/api/auth';
import { TenantPicker } from '@/features/auth/tenant_picker';
import { use_i18n } from '@/lib/i18n';
import { use_scope } from '@/stores/scope';
import { use_session } from '@/stores/session';
import type { SessionPayload, TenantOption } from '@/types/auth';
import './login_page.css';

interface LoginFormValues {
  account: string;
  password: string;
}

/** 登录页 —— 企微风格居中卡片。租户认证与用户认证共用（后端判 scope）。 */
export function LoginPage() {
  const { t } = use_i18n();
  const navigate = useNavigate();
  const set_session = use_session((state) => state.set_session);
  const set_tenant = use_scope((state) => state.set_tenant);

  const [submitting, set_submitting] = useState(false);
  const [error_msg, set_error_msg] = useState<string | null>(null);
  const [pending_ticket, set_pending_ticket] = useState<string | null>(null);
  const [pending_tenants, set_pending_tenants] = useState<TenantOption[]>([]);

  const enter_session = (session: SessionPayload) => {
    set_session(session);
    const first = session.tenants[0];
    if (first != null) {
      set_tenant({
        tenant_id: first.tenant_id,
        tenant_domain: first.domain,
        ui_language: first.ui_language,
      });
    }
    navigate('/overview', { replace: true });
  };

  const on_finish = async (values: LoginFormValues) => {
    set_submitting(true);
    set_error_msg(null);
    try {
      const result = await login(values);
      if (result.session != null) {
        enter_session(result.session);
      } else if (result.login_ticket != null && result.tenants != null) {
        set_pending_ticket(result.login_ticket);
        set_pending_tenants(result.tenants);
      } else {
        set_error_msg(t('auth.error_unknown'));
      }
    } catch (error) {
      set_error_msg(error instanceof Error ? error.message : String(error));
    } finally {
      set_submitting(false);
    }
  };

  // 多企业：切到「选择企业」视图。
  if (pending_ticket != null) {
    return <TenantPicker login_ticket={pending_ticket} tenants={pending_tenants} />;
  }

  return (
    <div className="login-page">
      <div className="login-page__brand">
        <div className="login-page__logo" aria-hidden>
          企
        </div>
        <span className="login-page__app-name">{t('app.name')}</span>
      </div>

      <div className="login-page__card">
        <h1 className="login-page__title">{t('auth.login_title')}</h1>

        <Form<LoginFormValues>
          layout="vertical"
          requiredMark={false}
          onFinish={on_finish}
          size="large"
        >
          <Form.Item
            name="account"
            label={t('auth.account')}
            rules={[{ required: true, whitespace: true, message: t('auth.account_required') }]}
          >
            <Input
              prefix={<UserOutlined />}
              autoComplete="username"
              placeholder={t('auth.account_placeholder')}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={t('auth.password')}
            rules={[{ required: true, message: t('auth.password_required') }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              autoComplete="current-password"
              placeholder={t('auth.password_placeholder')}
            />
          </Form.Item>

          {error_msg != null ? <p className="login-page__error">{error_msg}</p> : null}

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={submitting}
            className="login-page__submit"
          >
            {t('auth.login')}
          </Button>
        </Form>
      </div>

      <p className="login-page__footer">
        Mock 账号：admin / admin123（多企业）· member / member123（单企业）
      </p>
    </div>
  );
}
