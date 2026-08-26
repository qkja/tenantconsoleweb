import type { TenantInfo } from '@/types/tenantmanager';

/** MSW 企业信息夹具 —— tenantmanagersvr 编译失败，整模块 Mock。 */
export const mock_tenant_info: TenantInfo = {
  id: 't_001',
  name: '示例科技有限公司',
  code: 'TC-DEMO-001',
  domain: '1000001',
  contactName: '张伟',
  contactPhone: '13800001000',
  contactEmail: 'contact@example.com',
  status: 'paid',
  remark: '租户控制台演示企业',
  createTime: '2026-05-01T00:00:00Z',
  updateTime: '2026-06-01T00:00:00Z',
};
