import { beforeEach, describe, expect, it, vi } from 'vitest';
import { request } from '@/api/client';
import {
  change_password,
  get_profile,
  login,
  logout,
  refresh_session,
  set_user_password,
} from '@/api/auth';
import {
  create_directory,
  delete_directory,
  get_directory,
  list_directory,
  update_directory,
} from '@/api/directory';
import {
  create_organization,
  delete_organization,
  list_organization_children,
  search_organization,
  update_organization,
} from '@/api/organization';
import {
  create_security_group,
  delete_security_group,
  get_security_group,
  list_security_groups,
  update_security_group,
} from '@/api/security_group';
import { create_tenant, get_tenant } from '@/api/tenant';
import {
  create_user,
  delete_user,
  get_user,
  list_users,
  search_users,
  update_user,
} from '@/api/user';

vi.mock('@/api/client', () => ({ request: vi.fn() }));

const request_mock = vi.mocked(request);

describe('directory api', () => {
  beforeEach(() => request_mock.mockReset());

  it('list 拼 page/page_size', async () => {
    request_mock.mockResolvedValue({ list: [], total: 0 });
    await list_directory({ page: 1, page_size: 100 });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/directory/list', {
      params: { page: 1, page_size: 100 },
    });
  });

  it('get/create/update/delete 用对应方法与 body', async () => {
    request_mock.mockResolvedValue(undefined);
    await get_directory('1000001');
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/directory/get', {
      params: { domain: '1000001' },
    });

    await create_directory({ name: '主目录', domain: '1000001' });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/directory/create', {
      method: 'POST',
      body: { name: '主目录', domain: '1000001' },
    });

    await update_directory('1000001', { name: '改名' });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/directory/update', {
      method: 'PUT',
      body: { domain: '1000001', name: '改名' },
    });

    await delete_directory('1000001');
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/directory/delete', {
      method: 'DELETE',
      params: { domain: '1000001' },
    });
  });
});

describe('organization api', () => {
  beforeEach(() => request_mock.mockReset());

  it('children 按 domain+parent_id 串行展开', async () => {
    request_mock.mockResolvedValue({ list: [], total: 0, page: 1, page_size: 500 });
    await list_organization_children({ domain: '1000001', parent_id: 'org_a' });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/organization/children', {
      params: { domain: '1000001', parent_id: 'org_a' },
    });
  });

  it('search 拼 keyword', async () => {
    request_mock.mockResolvedValue({ list: [], total: 0, page: 1, page_size: 20 });
    await search_organization({ domain: '1000001', keyword: '研发' });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/organization/search', {
      params: { domain: '1000001', keyword: '研发' },
    });
  });

  it('update/delete 全量提交', async () => {
    request_mock.mockResolvedValue(undefined);
    await update_organization('org_a', '1000001', { name: '新名' });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/organization/update', {
      method: 'PUT',
      body: { id: 'org_a', domain: '1000001', name: '新名' },
    });

    await delete_organization('org_a', '1000001');
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/organization/delete', {
      method: 'DELETE',
      params: { id: 'org_a', domain: '1000001' },
    });
  });

  it('create 允许 parent_id 缺省（顶级）', async () => {
    request_mock.mockResolvedValue(undefined);
    await create_organization({ domain: '1000001', name: '顶级' });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/organization/create', {
      method: 'POST',
      body: { domain: '1000001', name: '顶级' },
    });
  });
});

describe('auth api（契约 docs/auth-contract.md）', () => {
  beforeEach(() => request_mock.mockReset());

  it('login（账号=域标识）/ refresh / logout / profile / change-password / set-password', async () => {
    request_mock.mockResolvedValue({} as never);
    await login({ domain: '1000001', password: 'admin123' });
    expect(request_mock).toHaveBeenCalledWith('/authnexus/v1/auth/login', {
      method: 'POST',
      body: { domain: '1000001', password: 'admin123' },
      skip_auth_refresh: true,
    });

    await refresh_session();
    expect(request_mock).toHaveBeenCalledWith('/authnexus/v1/auth/refresh', {
      method: 'POST',
      skip_auth_refresh: true,
    });

    await logout();
    expect(request_mock).toHaveBeenCalledWith('/authnexus/v1/auth/logout', {
      method: 'POST',
    });

    await get_profile();
    expect(request_mock).toHaveBeenCalledWith('/authnexus/v1/auth/profile', {
      method: 'GET',
    });

    await change_password({ old_password: 'a', new_password: 'b' });
    expect(request_mock).toHaveBeenCalledWith('/authnexus/v1/auth/change-password', {
      method: 'POST',
      body: { old_password: 'a', new_password: 'b' },
    });

    await set_user_password('u_1', 'abc12345');
    expect(request_mock).toHaveBeenCalledWith('/authnexus/v1/user/set-password', {
      method: 'POST',
      body: { user_id: 'u_1', new_password: 'abc12345' },
    });
  });
});

describe('security_group / user / tenant api', () => {
  beforeEach(() => request_mock.mockReset());

  it('security-group: list/get/create/update/delete', async () => {
    request_mock.mockResolvedValue({ list: [], total: 0 });
    await list_security_groups({ domain: '1000001' });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/security-group/list', {
      params: { domain: '1000001' },
    });

    request_mock.mockResolvedValue({} as never);
    await get_security_group('sg_1', '1000001');
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/security-group/get', {
      params: { id: 'sg_1', domain: '1000001' },
    });

    request_mock.mockResolvedValue(undefined);
    await create_security_group({ domain: '1000001', name: '管理员组' });
    await update_security_group('sg_1', '1000001', { name: '新名' });
    await delete_security_group('sg_1', '1000001');
    expect(request_mock).toHaveBeenNthCalledWith(3, '/identityhub/v1/security-group/create', {
      method: 'POST',
      body: { domain: '1000001', name: '管理员组' },
    });
    expect(request_mock).toHaveBeenNthCalledWith(4, '/identityhub/v1/security-group/update', {
      method: 'PUT',
      body: { id: 'sg_1', domain: '1000001', name: '新名' },
    });
    expect(request_mock).toHaveBeenNthCalledWith(5, '/identityhub/v1/security-group/delete', {
      method: 'DELETE',
      params: { id: 'sg_1', domain: '1000001' },
    });
  });

  it('user: list/get/create/update/delete', async () => {
    request_mock.mockResolvedValue({ list: [], total: 0, page: 1, page_size: 20 });
    await list_users({ domain: '1000001', org_id: 'org_a' });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/user/list', {
      params: { domain: '1000001', org_id: 'org_a' },
    });

    request_mock.mockResolvedValue({} as never);
    await get_user('u_1', '1000001');
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/user/get', {
      params: { id: 'u_1', domain: '1000001' },
    });

    request_mock.mockResolvedValue(undefined);
    await create_user({ domain: '1000001', username: 'lina', display_name: '李娜' });
    await update_user('u_1', '1000001', { display_name: '新名' });
    await delete_user('u_1', '1000001');
    expect(request_mock).toHaveBeenNthCalledWith(3, '/identityhub/v1/user/create', {
      method: 'POST',
      body: { domain: '1000001', username: 'lina', display_name: '李娜' },
    });
    expect(request_mock).toHaveBeenNthCalledWith(4, '/identityhub/v1/user/update', {
      method: 'PUT',
      body: { id: 'u_1', domain: '1000001', display_name: '新名' },
    });
    expect(request_mock).toHaveBeenNthCalledWith(5, '/identityhub/v1/user/delete', {
      method: 'DELETE',
      params: { id: 'u_1', domain: '1000001' },
    });
  });

  it('user: search 拼 keyword（identityhubsvr SearchUser）', async () => {
    request_mock.mockResolvedValue({ list: [], total: 0, page: 1, page_size: 20 });
    await search_users({ domain: '1000001', keyword: '张' });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/user/search', {
      params: { domain: '1000001', keyword: '张' },
    });
  });

  it('tenant: get 以 domain 寻址（camelCase 契约）', async () => {
    request_mock.mockResolvedValue({} as never);
    await get_tenant('1000001');
    expect(request_mock).toHaveBeenCalledWith('/tenantmanager/v1/tenant/get', {
      params: { domain: '1000001' },
    });

    request_mock.mockResolvedValue(undefined);
    await create_tenant({
      name: '示例科技',
      contactName: '张伟',
      contactPhone: '13800001000',
      contactEmail: 'c@example.com',
    });
    expect(request_mock).toHaveBeenCalledWith('/tenantmanager/v1/tenant/create', {
      method: 'POST',
      body: {
        name: '示例科技',
        contactName: '张伟',
        contactPhone: '13800001000',
        contactEmail: 'c@example.com',
      },
    });
  });
});
