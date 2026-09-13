import type { UserRoleInfo } from '@/types/identityhub';

/** MSW 用户角色夹具 —— 成员关系存 `users.user_role_codes`，由 user handler 推导。 */
export const mock_user_roles: UserRoleInfo[] = [
  {
    user_role_code: 'uro_01HX8ZK8T5VE6A3J9V1XCG7QFS',
    directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP',
    name: '研发',
    description: '研发中心成员',
    status: 'enable',
    created_at: 1757721600,
    updated_at: 1757721600,
  },
  {
    user_role_code: 'uro_01HX8ZK8T5VE6A3J9V1XCG7QFT',
    directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP',
    name: '人事',
    description: '人事组成员',
    status: 'enable',
    created_at: 1757721600,
    updated_at: 1757721600,
  },
];
