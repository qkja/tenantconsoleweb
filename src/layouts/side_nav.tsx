import {
  ApartmentOutlined,
  AppstoreOutlined,
  ClusterOutlined,
  IdcardOutlined,
  TagsOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Layout, Menu, type MenuProps } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { use_t } from '@/lib/i18n';
import './side_nav.css';

type MenuItem = Required<MenuProps>['items'][number];

/** 侧边导航 —— 企微管理后台形态：通讯录/权限管理/企业管理分组。 */
export function SideNav() {
  const t = use_t();
  const navigate = useNavigate();
  const location = useLocation();

  const items: MenuItem[] = [
    { key: '/overview', icon: <AppstoreOutlined />, label: t('nav.overview') },
    {
      type: 'group',
      label: t('contacts.group'),
      children: [
        { key: '/directory', icon: <ClusterOutlined />, label: t('nav.directory') },
        { key: '/organization', icon: <ApartmentOutlined />, label: t('nav.organization') },
        { key: '/member', icon: <TeamOutlined />, label: t('nav.member') },
      ],
    },
    {
      type: 'group',
      label: t('security.group'),
      children: [
        { key: '/user-role', icon: <TagsOutlined />, label: t('nav.user_role') },
      ],
    },
    {
      type: 'group',
      label: t('company.group'),
      children: [{ key: '/tenant', icon: <IdcardOutlined />, label: t('nav.tenant') }],
    },
  ];

  const selected_key = `/${location.pathname.split('/')[1] ?? 'overview'}`;

  return (
    <Layout.Sider width={232} className="side-nav">
      <Menu
        mode="inline"
        className="side-nav__menu"
        items={items}
        selectedKeys={[selected_key]}
        onClick={({ key }) => navigate(key)}
      />
    </Layout.Sider>
  );
}
