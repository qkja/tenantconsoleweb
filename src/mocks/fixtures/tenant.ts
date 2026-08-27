import type { TenantAdminInfo, TenantInfo } from '@/types/tenantmanager';

/** MSW 企业信息夹具 —— 契约对齐真实后端（id/domain 后端生成、无 code 字段）。 */
export const mock_tenant_info: TenantInfo = {
  id: 't_001',
  name: '示例科技有限公司',
  domain: '1000001',
  contactName: '张伟',
  contactPhone: '13800001000',
  contactEmail: 'contact@example.com',
  status: 'paid',
  remark: '租户控制台演示企业',
  createTime: '2026-05-01T00:00:00Z',
  updateTime: '2026-06-01T00:00:00Z',
  admins: [{ account: '1000001', displayName: '张伟', status: 'enable' }],
};

/** 租户管理员（可变的 mock 数组，add/status 直接反映）。 */
export const mock_tenant_admins: TenantAdminInfo[] = [
  { account: '1000001', displayName: '张伟', status: 'enable' },
];
