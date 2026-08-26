import type { SecurityGroupInfo } from '@/types/identityhub';

/** MSW 安全组夹具 —— 后端 ListSecurityGroup 缺失。 */
export const mock_security_groups: SecurityGroupInfo[] = [
  {
    id: 'sg_001',
    tenant_id: 't_001',
    domain: '1000001',
    name: '管理员组',
    code: 'ADMIN',
    description: '系统管理员，拥有租户内全部权限',
    external_id: '',
    created_at: '2026-06-01T10:00:00Z',
    updated_at: '2026-06-01T10:00:00Z',
  },
  {
    id: 'sg_002',
    tenant_id: 't_001',
    domain: '1000001',
    name: '人事组',
    code: 'HR',
    description: '人事管理权限',
    external_id: '',
    created_at: '2026-06-01T10:00:00Z',
    updated_at: '2026-06-01T10:00:00Z',
  },
];
