import { ThunderboltOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  App,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Space,
  Switch,
  Tag,
} from 'antd';
import { useEffect, useState } from 'react';
import { get_sync_config, trigger_sync, update_sync_config } from '@/api/sync';
import { use_directory_list } from '@/hooks/queries/use_directory_list';
import { format_unix_time } from '@/lib/format';
import { use_t } from '@/lib/i18n';
import { use_scope } from '@/stores/scope';
import type { SyncFieldMapping } from '@/types/identityhub';
import './sync_page.css';

interface SyncConfigFormValues {
  server_url: string;
  base_dn?: string;
  bind_dn?: string;
  bind_password?: string;
  external_id_field: string;
  field_mappings: SyncFieldMapping[];
  sync_interval_minutes: number;
  enabled: boolean;
  scope_organization: boolean;
  scope_user: boolean;
  scope_user_role: boolean;
}

const LOCAL_FIELD_OPTIONS = [
  { value: 'name', label: 'name' },
  { value: 'email', label: 'email' },
  { value: 'country_code', label: 'country_code' },
  { value: 'phone', label: 'phone' },
  { value: 'organization_code', label: 'organization_code' },
  { value: 'description', label: 'description' },
];

/** 同步配置 —— 仅 ad / ldap 目录域；绑定密码仅可写不可读；单向不回写。 */
export function SyncConfigPage() {
  const t = use_t();
  const { message } = App.useApp();
  const [form] = Form.useForm<SyncConfigFormValues>();
  const { directory_code } = use_scope();
  const { data: directories = [] } = use_directory_list();
  const ad_ldap_dirs = directories.filter((dir) => dir.type !== 'local');

  const [selected, set_selected] = useState<string | undefined>(undefined);
  const dir_code = selected ?? directory_code ?? ad_ldap_dirs[0]?.directory_code;

  const { data: config, refetch } = useQuery({
    queryKey: ['sync', 'config', dir_code],
    queryFn: () => get_sync_config(dir_code ?? ''),
    enabled: dir_code != null && dir_code !== '',
  });

  useEffect(() => {
    if (config != null) {
      form.setFieldsValue({
        server_url: config.server_url,
        base_dn: config.base_dn,
        bind_dn: config.bind_dn,
        bind_password: '',
        external_id_field: config.external_id_field,
        field_mappings: config.field_mappings,
        sync_interval_minutes: config.sync_interval_minutes,
        enabled: config.enabled,
        scope_organization: config.scope_organization,
        scope_user: config.scope_user,
        scope_user_role: config.scope_user_role,
      });
    }
  }, [config, form]);

  const on_finish = async (values: SyncConfigFormValues) => {
    if (dir_code == null) {
      return;
    }
    try {
      await update_sync_config({
        directory_code: dir_code,
        server_url: values.server_url,
        base_dn: values.base_dn,
        bind_dn: values.bind_dn,
        bind_password: values.bind_password?.trim() || undefined,
        external_id_field: values.external_id_field,
        field_mappings: values.field_mappings,
        sync_interval_minutes: values.sync_interval_minutes,
        enabled: values.enabled,
        scope_organization: values.scope_organization,
        scope_user: values.scope_user,
        scope_user_role: values.scope_user_role,
      });
      message.success(t('common.saved'));
      void refetch();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  const on_trigger = async () => {
    if (dir_code == null) {
      return;
    }
    try {
      const data = await trigger_sync(dir_code);
      message.success(data.sync_record_code);
      void refetch();
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
    }
  };

  if (ad_ldap_dirs.length === 0) {
    return (
      <div className="sync-page">
        <Card>{t('sync.no_directory_hint')}</Card>
      </div>
    );
  }

  return (
    <div className="sync-page">
      <Card
        title={t('sync.title')}
        extra={
          <Space>
            <Select
              className="sync-page__dir-select"
              value={dir_code}
              onChange={set_selected}
              placeholder={t('sync.select_directory')}
              options={ad_ldap_dirs.map((dir) => ({ label: dir.name, value: dir.directory_code }))}
            />
            <Popconfirm title={t('sync.trigger_confirm')} onConfirm={() => void on_trigger()}>
              <Button type="primary" icon={<ThunderboltOutlined />}>
                {t('sync.trigger')}
              </Button>
            </Popconfirm>
          </Space>
        }
      >
        <p className="sync-page__hint">{t('sync.one_way_hint')}</p>
        {config != null ? (
          <Space size={16} className="sync-page__meta">
            <span>
              {t('sync.provider')}: <Tag>{config.provider}</Tag>
            </span>
            <span>
              {t('sync.last_sync_at')}: {format_unix_time(config.last_sync_at)}
            </span>
            <span>
              {t('sync.last_sync_status')}: <Tag>{config.last_sync_status || '—'}</Tag>
            </span>
          </Space>
        ) : null}

        <Form form={form} layout="vertical" onFinish={on_finish}>
          <Form.Item
            name="server_url"
            label={t('sync.server_url')}
            rules={[{ required: true, message: t('sync.server_url_required') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="base_dn" label={t('sync.base_dn')}>
            <Input />
          </Form.Item>
          <Form.Item name="bind_dn" label={t('sync.bind_dn')}>
            <Input />
          </Form.Item>
          <Form.Item name="bind_password" label={t('sync.bind_password')} extra={t('sync.bind_password_hint')}>
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="external_id_field"
            label={t('sync.external_id_field')}
            rules={[{ required: true, message: t('sync.external_id_field_required') }]}
            extra={t('sync.external_id_field_hint')}
          >
            <Input />
          </Form.Item>

          <Form.Item label={t('sync.field_mappings')}>
            <Form.List name="field_mappings">
              {(fields, { add, remove }) => (
                <div className="sync-page__mappings">
                  {fields.map((field) => (
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        name={[field.name, 'external_field']}
                        rules={[{ required: true, message: t('sync.external_field') }]}
                      >
                        <Input placeholder={t('sync.external_field')} />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'local_field']}
                        rules={[{ required: true, message: t('sync.local_field') }]}
                      >
                        <Select options={LOCAL_FIELD_OPTIONS} style={{ width: 200 }} />
                      </Form.Item>
                      <Button type="text" danger onClick={() => remove(field.name)}>
                        ×
                      </Button>
                    </Space>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add({ external_field: '', local_field: '' })}
                  >
                    {t('sync.add_mapping')}
                  </Button>
                </div>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item name="sync_interval_minutes" label={t('sync.sync_interval_minutes')} extra={t('sync.sync_interval_hint')}>
            <InputNumber min={0} max={10080} style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="enabled" label={t('sync.enabled')} valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="scope_organization" label={t('sync.scope_organization')} valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="scope_user" label={t('sync.scope_user')} valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="scope_user_role" label={t('sync.scope_user_role')} valuePropName="checked">
            <Switch />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            {t('common.save')}
          </Button>
        </Form>
      </Card>
    </div>
  );
}
