import type { DirectoryInfo } from '@/types/identityhub';

/** MSW 目录域夹具 —— 让 Mock 模式下的切换器/目录页/作用域解析有数据。 */
export const mock_directories: DirectoryInfo[] = [
  {
    directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP',
    name: '主目录',
    type: 'local',
    description: '企业主通讯录',
    status: 'enable',
    sync_configured: false,
    created_at: 1757721600,
    updated_at: 1757721600,
  },
  {
    directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCQ',
    name: '海外目录',
    type: 'ldap',
    description: '海外分部 LDAP',
    status: 'enable',
    sync_configured: true,
    created_at: 1757721600,
    updated_at: 1757721600,
  },
];
