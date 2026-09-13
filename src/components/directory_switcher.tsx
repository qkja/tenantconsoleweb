import { DownOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { use_directory_list } from '@/hooks/queries/use_directory_list';
import { use_i18n } from '@/lib/i18n';
import { use_scope } from '@/stores/scope';
import './directory_switcher.css';

/**
 * 顶栏目录域切换器（类比云控制台「地域」）。
 * 目录域属于租户作用域：切换租户后自动清空，需重新选择。
 */
export function DirectorySwitcher() {
  const { t } = use_i18n();
  const { tenant_code, directory_code, set_directory_code } = use_scope();
  const { data: directories = [] } = use_directory_list();

  const current = directories.find((item) => item.directory_code === directory_code);

  return (
    <Dropdown
      trigger={['click']}
      disabled={tenant_code == null || directories.length === 0}
      menu={{
        items: directories.map((item) => ({
          key: item.directory_code,
          label: item.name,
          icon: <FolderOpenOutlined />,
        })),
        onClick: ({ key }) => set_directory_code(key),
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
