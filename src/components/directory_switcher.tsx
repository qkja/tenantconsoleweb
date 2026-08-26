import { DownOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { use_i18n } from '@/lib/i18n';
import { use_scope } from '@/stores/scope';

/**
 * 顶栏目录域切换器（类比云控制台「地域」）。
 * 目录域属于租户作用域：切换租户后自动清空，需重新选择。
 * 阶段 4 用 use_directory_list 真实数据替换 PLACEHOLDER_DOMAINS。
 */
const PLACEHOLDER_DOMAINS = [
  { domain: '1000001', name: '主目录' },
  { domain: '1000002', name: '分目录 B' },
];

export function DirectorySwitcher() {
  const { t } = use_i18n();
  const { tenant_id, directory_domain, set_directory_domain } = use_scope();

  const current = PLACEHOLDER_DOMAINS.find((item) => item.domain === directory_domain);

  return (
    <Dropdown
      trigger={['click']}
      disabled={tenant_id == null}
      menu={{
        items: PLACEHOLDER_DOMAINS.map((item) => ({
          key: item.domain,
          label: item.name,
          icon: <FolderOpenOutlined />,
        })),
        onClick: ({ key }) => set_directory_domain(key),
      }}
    >
      <Button type="text" className="directory-switcher">
        <Space size={4}>
          <FolderOpenOutlined />
          <span className="directory-switcher__name">
            {current?.name ?? t('topbar.directory_switcher')}
          </span>
          <DownOutlined className="directory-switcher__caret" />
        </Space>
      </Button>
    </Dropdown>
  );
}
