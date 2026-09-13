import type { OrganizationInfo } from '@/types/identityhub';

const ROOT = 'org_01HX8ZK6R3SC4Y1G7T9VAE5NDQ';
const DEV = 'org_01HX8ZK6R3SC4Y1G7T9VAE5NDR';
const MKT = 'org_01HX8ZK6R3SC4Y1G7T9VAE5NDS';

/** MSW 组织夹具 —— 物化路径 string（含自身、首尾 `/`）。 */
export const mock_organizations: OrganizationInfo[] = [
  {
    organization_code: ROOT,
    directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP',
    parent_code: '',
    name: '示例科技总部',
    description: '公司总部',
    org_type: 'company',
    external_id: '',
    level: 0,
    path: `/${ROOT}/`,
    created_at: 1757721600,
    updated_at: 1757721600,
  },
  {
    organization_code: DEV,
    directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP',
    parent_code: ROOT,
    name: '研发部',
    description: '产品与技术研发',
    org_type: 'dept',
    external_id: '',
    level: 1,
    path: `/${ROOT}/${DEV}/`,
    created_at: 1757721600,
    updated_at: 1757721600,
  },
  {
    organization_code: MKT,
    directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP',
    parent_code: ROOT,
    name: '市场部',
    description: '市场与品牌',
    org_type: 'dept',
    external_id: '',
    level: 1,
    path: `/${ROOT}/${MKT}/`,
    created_at: 1757721600,
    updated_at: 1757721600,
  },
];
