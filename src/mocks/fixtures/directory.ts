import type { DirectoryInfo } from '@/types/identityhub';

/** MSW 目录域夹具 —— 让 Mock 模式下的切换器/目录页/作用域解析有数据。 */
export const mock_directories: DirectoryInfo[] = [
  {
    id: 'dir_001',
    tenant_id: 't_001',
    name: '主目录',
    domain: '1000001',
    description: '企业主通讯录',
    created_at: '2026-06-01T10:00:00Z',
    updated_at: '2026-06-01T10:00:00Z',
  },
  {
    id: 'dir_002',
    tenant_id: 't_001',
    name: '分目录-海外',
    domain: '1000002',
    description: '海外分部通讯录',
    created_at: '2026-06-02T10:00:00Z',
    updated_at: '2026-06-02T10:00:00Z',
  },
];
