import { App, Button, Card, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { change_password } from '@/api/auth';
import { use_i18n } from '@/lib/i18n';
import './change_password.css';

interface ChangePasswordFormValues {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

/** 修改密码页（控制台内）。 */
export function ChangePassword() {
  const { t } = use_i18n();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm<ChangePasswordFormValues>();

  const on_finish = async (values: ChangePasswordFormValues) => {
    try {
      await change_password({
        old_password: values.old_password,
        new_password: values.new_password,
      });
      message.success(t('auth.password_updated'));
      form.resetFields();
      navigate('/overview');
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div className="change-password">
      <Card className="change-password__card" title={t('auth.change_password_title')}>
        <Form<ChangePasswordFormValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={on_finish}
        >
          <Form.Item
            name="old_password"
            label={t('auth.old_password')}
            rules={[{ required: true, message: t('auth.password_required') }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>

          <Form.Item
            name="new_password"
            label={t('auth.new_password')}
            rules={[{ required: true, min: 8, message: t('auth.password_required') }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label={t('auth.confirm_password')}
            dependencies={['new_password']}
            rules={[
              { required: true, message: t('auth.password_required') },
              ({ getFieldValue }) => ({
                validator: (_, value) =>
                  value == null || value === '' || getFieldValue('new_password') === value
                    ? Promise.resolve()
                    : Promise.reject(new Error(t('auth.confirm_mismatch'))),
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            {t('auth.change_password_title')}
          </Button>
        </Form>
      </Card>
    </div>
  );
}
