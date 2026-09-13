import { beforeEach, describe, expect, it, vi } from 'vitest';
import { request } from '@/api/client';
import {
  change_password,
  login,
  logout,
  refresh_session,
} from '@/api/auth';
import {
  create_directory,
  delete_directory,
  get_directory,
  list_directory,
  update_directory,
  update_directory_status,
} from '@/api/directory';
import {
  create_organization,
  delete_organization,
  list_organization_children,
  update_organization,
} from '@/api/organization';
import {
  create_user,
  delete_user,
  get_user,
  list_users,
  update_user,
  update_user_status,
} from '@/api/user';
import {
  add_user_role_members,
  create_user_role,
  delete_user_role,
  list_user_role_members,
  list_user_roles,
  remove_user_role_members,
  update_user_role,
} from '@/api/user_role';
import {
  get_current_admin,
  get_current_tenant,
  update_current_admin,
  update_current_tenant,
} from '@/api/tenant';

vi.mock('@/api/client', () => ({ request: vi.fn() }));

const request_mock = vi.mocked(request);

describe('directory api', () => {
  beforeEach(() => request_mock.mockReset());

  it('list 拼分页 + 排序', async () => {
    request_mock.mockResolvedValue({ list: [], total: 0, page: 1, page_size: 100 });
    await list_directory({ page: 1, page_size: 100, sort_by: 'created_at', descending: 'desc' });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/directories/list', {
      params: { page: 1, page_size: 100, sort_by: 'created_at', descending: 'desc' },
    });
  });

  it('get/create/update/delete/status 用对应方法与 body', async () => {
    request_mock.mockResolvedValue(undefined);
    await get_directory('dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP');
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/directories/get', {
      params: { directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP' },
    });

    await create_directory({ name: '主目录', type: 'local' });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/directories/create', {
      method: 'POST',
      body: { name: '主目录', type: 'local' },
    });

    await update_directory('dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP', { name: '改名' });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/directories/update', {
      method: 'PUT',
      body: { directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP', name: '改名' },
    });

    await delete_directory('dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP');
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/directories/delete', {
      method: 'DELETE',
      body: { directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP' },
    });

    await update_directory_status('dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP', 'disable');
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/directories/status', {
      method: 'PUT',
      body: { directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP', status: 'disable' },
    });
  });
});

describe('organization api', () => {
  beforeEach(() => request_mock.mockReset());

  it('children 按 directory_code+parent_code 串行展开', async () => {
    request_mock.mockResolvedValue({ list: [], total: 0, page: 1, page_size: 500 });
    await list_organization_children({
      directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP',
      parent_code: 'org_01HX8ZK6R3SC4Y1G7T9VAE5NDQ',
    });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/organization/children', {
      params: {
        directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP',
        parent_code: 'org_01HX8ZK6R3SC4Y1G7T9VAE5NDQ',
      },
    });
  });

  it('create/update/delete 全量提交', async () => {
    request_mock.mockResolvedValue(undefined);
    await create_organization({
      directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP',
      name: '研发部',
    });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/organization/create', {
      method: 'POST',
      body: { directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP', name: '研发部' },
    });

    await update_organization('org_01HX8ZK6R3SC4Y1G7T9VAE5NDQ', 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP', {
      name: '新名',
    });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/organization/update', {
      method: 'PUT',
      body: {
        organization_code: 'org_01HX8ZK6R3SC4Y1G7T9VAE5NDQ',
        directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP',
        name: '新名',
      },
    });

    await delete_organization('org_01HX8ZK6R3SC4Y1G7T9VAE5NDQ', 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP');
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/organization/delete', {
      method: 'DELETE',
      params: {
        organization_code: 'org_01HX8ZK6R3SC4Y1G7T9VAE5NDQ',
        directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP',
      },
    });
  });
});

describe('auth api', () => {
  beforeEach(() => request_mock.mockReset());

  it('login 以 name 登录 / refresh / logout / change-password', async () => {
    request_mock.mockResolvedValue({} as never);
    await login({ name: 'admin', password: 'admin123' });
    expect(request_mock).toHaveBeenCalledWith('/authnexus/v1/tenant/login', {
      method: 'POST',
      body: { name: 'admin', password: 'admin123' },
      skip_auth_refresh: true,
    });

    await refresh_session();
    expect(request_mock).toHaveBeenCalledWith('/authnexus/v1/tenant/refresh', {
      method: 'POST',
      skip_auth_refresh: true,
    });

    await logout();
    expect(request_mock).toHaveBeenCalledWith('/authnexus/v1/tenant/logout', { method: 'POST' });

    await change_password({ old_password: 'a', new_password: 'b' });
    expect(request_mock).toHaveBeenCalledWith('/authnexus/v1/tenant/password', {
      method: 'PUT',
      body: { old_password: 'a', new_password: 'b' },
    });
  });
});

describe('user / user_role api', () => {
  beforeEach(() => request_mock.mockReset());

  it('user: list/get/create/update/delete/status', async () => {
    request_mock.mockResolvedValue({ list: [], total: 0, page: 1, page_size: 500 });
    await list_users({ directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP' });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/users/list', {
      params: { directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP' },
    });

    request_mock.mockResolvedValue(undefined);
    await get_user('usr_01HX8ZK7S4TD5Z2H8V0WBF6PER');
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/users/get', {
      params: { user_code: 'usr_01HX8ZK7S4TD5Z2H8V0WBF6PER' },
    });

    await create_user({
      directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP',
      name: '张伟',
      status: 'enable',
      password: 'abc123',
    });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/users/create', {
      method: 'POST',
      body: {
        directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP',
        name: '张伟',
        status: 'enable',
        password: 'abc123',
      },
    });

    await update_user('usr_01HX8ZK7S4TD5Z2H8V0WBF6PER', { name: '新名' });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/users/update', {
      method: 'PUT',
      body: { user_code: 'usr_01HX8ZK7S4TD5Z2H8V0WBF6PER', name: '新名' },
    });

    await delete_user('usr_01HX8ZK7S4TD5Z2H8V0WBF6PER');
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/users/delete', {
      method: 'DELETE',
      body: { user_code: 'usr_01HX8ZK7S4TD5Z2H8V0WBF6PER' },
    });

    await update_user_status('usr_01HX8ZK7S4TD5Z2H8V0WBF6PER', 'disable');
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/users/status', {
      method: 'PUT',
      body: { user_code: 'usr_01HX8ZK7S4TD5Z2H8V0WBF6PER', status: 'disable' },
    });
  });

  it('user_role: list/create/update/delete + members', async () => {
    request_mock.mockResolvedValue({ list: [], total: 0, page: 1, page_size: 500 });
    await list_user_roles({ directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP' });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/user-roles/list', {
      params: { directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP' },
    });

    request_mock.mockResolvedValue(undefined);
    await create_user_role({ directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP', name: '研发' });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/user-roles/create', {
      method: 'POST',
      body: { directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP', name: '研发' },
    });

    await update_user_role('uro_01HX8ZK8T5VE6A3J9V1XCG7QFS', { name: '研发中心' });
    await delete_user_role('uro_01HX8ZK8T5VE6A3J9V1XCG7QFS');
    expect(request_mock).toHaveBeenNthCalledWith(3, '/identityhub/v1/user-roles/update', {
      method: 'PUT',
      body: { user_role_code: 'uro_01HX8ZK8T5VE6A3J9V1XCG7QFS', name: '研发中心' },
    });
    expect(request_mock).toHaveBeenNthCalledWith(4, '/identityhub/v1/user-roles/delete', {
      method: 'DELETE',
      body: { user_role_code: 'uro_01HX8ZK8T5VE6A3J9V1XCG7QFS' },
    });

    request_mock.mockResolvedValue({ list: [], total: 0, page: 1, page_size: 500 });
    await list_user_role_members({ user_role_code: 'uro_01HX8ZK8T5VE6A3J9V1XCG7QFS' });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/user-roles/members', {
      params: { user_role_code: 'uro_01HX8ZK8T5VE6A3J9V1XCG7QFS' },
    });

    request_mock.mockResolvedValue(undefined);
    await add_user_role_members('uro_01HX8ZK8T5VE6A3J9V1XCG7QFS', ['usr_01HX8ZK7S4TD5Z2H8V0WBF6PER']);
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/user-roles/members', {
      method: 'POST',
      body: {
        user_role_code: 'uro_01HX8ZK8T5VE6A3J9V1XCG7QFS',
        user_codes: ['usr_01HX8ZK7S4TD5Z2H8V0WBF6PER'],
      },
    });

    await remove_user_role_members('uro_01HX8ZK8T5VE6A3J9V1XCG7QFS', ['usr_01HX8ZK7S4TD5Z2H8V0WBF6PER']);
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/user-roles/members', {
      method: 'DELETE',
      body: {
        user_role_code: 'uro_01HX8ZK8T5VE6A3J9V1XCG7QFS',
        user_codes: ['usr_01HX8ZK7S4TD5Z2H8V0WBF6PER'],
      },
    });
  });
});

describe('tenant self-service api', () => {
  beforeEach(() => request_mock.mockReset());

  it('me / me/admin get & update', async () => {
    request_mock.mockResolvedValue({} as never);
    await get_current_tenant();
    expect(request_mock).toHaveBeenCalledWith('/tenantmanager/v1/me');

    await get_current_admin();
    expect(request_mock).toHaveBeenCalledWith('/tenantmanager/v1/me/admin');

    request_mock.mockResolvedValue(undefined);
    await update_current_tenant({ customer_name: '新名' });
    expect(request_mock).toHaveBeenCalledWith('/tenantmanager/v1/me', {
      method: 'PUT',
      body: { customer_name: '新名' },
    });

    await update_current_admin({ name: '新管理员' });
    expect(request_mock).toHaveBeenCalledWith('/tenantmanager/v1/me/admin', {
      method: 'PUT',
      body: { name: '新管理员' },
    });
  });
});
