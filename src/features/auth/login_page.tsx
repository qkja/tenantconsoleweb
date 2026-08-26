import { LockOutlined, NumberOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '@/api/auth';
import { use_i18n } from '@/lib/i18n';
import { use_scope } from '@/stores/scope';
import { use_session } from '@/stores/session';
import './login_page.css';

interface LoginFormValues {
  domain: string;
  password: string;
}

/** 登录页 —— 账号 = 租户 domain（7 位数字），无多企业选择。 */
export function LoginPage() {
  const { t } = use_i18n();
  const navigate = useNavigate();
  const set_session = use_session((state) => state.set_session);
  const set_tenant = use_scope((state) => state.set_tenant);

  const [submitting, set_submitting] = useState(false);
  const [error_msg, set_error_msg] = useState<string | null>(null);

  const on_finish = async (values: LoginFormValues) => {
    set_submitting(true);
    set_error_msg(null);
    try {
      const session = await login(values);
      set_session(session);
      set_tenant({
        tenant_id: session.tenant.tenant_id,
        tenant_domain: session.tenant.domain,
        ui_language: session.tenant.ui_language,
      });
      navigate('/overview', { replace: true });
    } catch (error) {
      set_error_msg(error instanceof Error ? error.message : String(error));
    } finally {
      set_submitting(false);
    }
  };

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
            name="domain"
            label={t('auth.domain')}
            rules={[{ required: true, pattern: /^\d{7}$/, message: t('auth.domain_required') }]}
          >
            <Input
              prefix={<NumberOutlined />}
              autoComplete="username"
              placeholder={t('auth.domain_placeholder')}
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

      <p className="login-page__footer">Mock：域标识 1000001 · 密码 admin123</p>
    </div>
  );
}
