import { beforeEach, describe, expect, it, vi } from 'vitest';
import { request } from '@/api/client';
import {
  create_tenant_role,
  delete_tenant_role,
  list_tenant_roles,
  update_tenant_role,
  update_tenant_role_status,
} from '@/api/tenant_role';
import {
  create_tenant_admin,
  delete_tenant_admin,
  list_tenant_admins,
  reset_tenant_admin_password,
  set_tenant_admin_roles,
  update_tenant_admin,
  update_tenant_admin_status,
} from '@/api/tenant_admin';
import {
  get_sync_config,
  list_sync_record_failures,
  list_sync_records,
  trigger_sync,
  update_sync_config,
} from '@/api/sync';

vi.mock('@/api/client', () => ({ request: vi.fn() }));

const request_mock = vi.mocked(request);

describe('tenant_role api', () => {
  beforeEach(() => request_mock.mockReset());

  it('list 拼分页 + 排序', async () => {
    request_mock.mockResolvedValue({ list: [], total: 0, page: 1, page_size: 500 });
    await list_tenant_roles({ page: 1, page_size: 500, sort_by: 'created_at', descending: 'desc' });
    expect(request_mock).toHaveBeenCalledWith('/tenantmanager/v1/tenant-roles/list', {
      params: { page: 1, page_size: 500, sort_by: 'created_at', descending: 'desc' },
    });
  });

  it('create 提交页面权限 + 双轴数据范围', async () => {
    request_mock.mockResolvedValue({ tenant_role_code: 'tro_x' });
    await create_tenant_role({
      name: '运营',
      page_codes: ['tenant.member'],
      scope_organization_codes: ['org_x'],
      scope_directory_codes: ['dir_x'],
    });
    expect(request_mock).toHaveBeenCalledWith('/tenantmanager/v1/tenant-roles/create', {
      method: 'POST',
      body: {
        name: '运营',
        page_codes: ['tenant.member'],
        scope_organization_codes: ['org_x'],
        scope_directory_codes: ['dir_x'],
      },
    });
  });

  it('update 全量覆盖（load-then-merge）', async () => {
    request_mock.mockResolvedValue(undefined);
    await update_tenant_role('tro_x', {
      name: '运营',
      description: 'd',
      page_codes: ['tenant.member'],
      scope_organization_codes: ['org_x'],
      scope_directory_codes: [],
    });
    expect(request_mock).toHaveBeenCalledWith('/tenantmanager/v1/tenant-roles/update', {
      method: 'PUT',
      body: {
        tenant_role_code: 'tro_x',
        name: '运营',
        description: 'd',
        page_codes: ['tenant.member'],
        scope_organization_codes: ['org_x'],
        scope_directory_codes: [],
      },
    });
  });

  it('delete / status 用 body', async () => {
    request_mock.mockResolvedValue(undefined);
    await delete_tenant_role('tro_x');
    expect(request_mock).toHaveBeenCalledWith('/tenantmanager/v1/tenant-roles/delete', {
      method: 'DELETE',
      body: { tenant_role_code: 'tro_x' },
    });

    await update_tenant_role_status('tro_x', 'disable');
    expect(request_mock).toHaveBeenCalledWith('/tenantmanager/v1/tenant-roles/status', {
      method: 'PUT',
      body: { tenant_role_code: 'tro_x', status: 'disable' },
    });
  });
});

describe('tenant_admin api', () => {
  beforeEach(() => request_mock.mockReset());

  it('list / create（含锁定字段组 + 角色绑定）', async () => {
    request_mock.mockResolvedValue({ list: [], total: 0, page: 1, page_size: 500 });
    await list_tenant_admins({ page: 1, page_size: 500, sort_by: 'created_at', descending: 'desc' });
    expect(request_mock).toHaveBeenCalledWith('/tenantmanager/v1/tenant-admins/list', {
      params: { page: 1, page_size: 500, sort_by: 'created_at', descending: 'desc' },
    });

    request_mock.mockResolvedValue({ tenant_admin_code: 'tnu_x' });
    await create_tenant_admin({
      name: '王芳',
      password: 'abc123',
      status: 'enable',
      role_codes: ['tro_x'],
      must_change_password: true,
      max_login_failures: 5,
      login_fail_window: 15,
      login_fail_window_unit: 'minute',
      is_locked: false,
    });
    expect(request_mock).toHaveBeenCalledWith('/tenantmanager/v1/tenant-admins/create', {
      method: 'POST',
      body: {
        name: '王芳',
        password: 'abc123',
        status: 'enable',
        role_codes: ['tro_x'],
        must_change_password: true,
        max_login_failures: 5,
        login_fail_window: 15,
        login_fail_window_unit: 'minute',
        is_locked: false,
      },
    });
  });

  it('update 全量提交姓名 + 锁定字段组', async () => {
    request_mock.mockResolvedValue(undefined);
    await update_tenant_admin('tnu_x', {
      name: '王芳（运营）',
      max_login_failures: 3,
      login_fail_window: 10,
      login_fail_window_unit: 'minute',
    });
    expect(request_mock).toHaveBeenCalledWith('/tenantmanager/v1/tenant-admins/update', {
      method: 'PUT',
      body: {
        tenant_admin_code: 'tnu_x',
        name: '王芳（运营）',
        max_login_failures: 3,
        login_fail_window: 10,
        login_fail_window_unit: 'minute',
      },
    });
  });

  it('delete / status / roles（全量覆盖）/ reset-password（无密码入参）', async () => {
    request_mock.mockResolvedValue(undefined);
    await delete_tenant_admin('tnu_x');
    expect(request_mock).toHaveBeenCalledWith('/tenantmanager/v1/tenant-admins/delete', {
      method: 'DELETE',
      body: { tenant_admin_code: 'tnu_x' },
    });

    await update_tenant_admin_status('tnu_x', 'disable');
    expect(request_mock).toHaveBeenCalledWith('/tenantmanager/v1/tenant-admins/status', {
      method: 'PUT',
      body: { tenant_admin_code: 'tnu_x', status: 'disable' },
    });

    await set_tenant_admin_roles('tnu_x', ['tro_a', 'tro_b']);
    expect(request_mock).toHaveBeenCalledWith('/tenantmanager/v1/tenant-admins/roles', {
      method: 'PUT',
      body: { tenant_admin_code: 'tnu_x', role_codes: ['tro_a', 'tro_b'] },
    });

    request_mock.mockResolvedValue({ new_password: 'Tmp8Xk2q' });
    await reset_tenant_admin_password('tnu_x');
    expect(request_mock).toHaveBeenCalledWith('/tenantmanager/v1/tenant-admins/reset-password', {
      method: 'PUT',
      body: { tenant_admin_code: 'tnu_x' },
    });
  });
});

describe('sync api', () => {
  beforeEach(() => request_mock.mockReset());

  it('config get / update（绑定密码空 = 不修改）', async () => {
    request_mock.mockResolvedValue({} as never);
    await get_sync_config('dir_x');
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/sync/config/get', {
      params: { directory_code: 'dir_x' },
    });

    request_mock.mockResolvedValue(undefined);
    await update_sync_config({
      directory_code: 'dir_x',
      server_url: 'ldap://x',
      external_id_field: 'entryUUID',
      field_mappings: [{ external_field: 'cn', local_field: 'name' }],
      enabled: true,
    });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/sync/config/update', {
      method: 'PUT',
      body: {
        directory_code: 'dir_x',
        server_url: 'ldap://x',
        external_id_field: 'entryUUID',
        field_mappings: [{ external_field: 'cn', local_field: 'name' }],
        enabled: true,
      },
    });
  });

  it('trigger / records list / failures', async () => {
    request_mock.mockResolvedValue({ sync_record_code: 'syn_x' });
    await trigger_sync('dir_x');
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/sync/trigger', {
      method: 'POST',
      body: { directory_code: 'dir_x' },
    });

    request_mock.mockResolvedValue({ list: [], total: 0, page: 1, page_size: 500 });
    await list_sync_records({ sort_by: 'started_at', descending: 'desc' });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/sync/records/list', {
      params: { sort_by: 'started_at', descending: 'desc' },
    });

    await list_sync_record_failures({
      sync_record_code: 'syn_x',
      sort_by: 'created_at',
      descending: 'desc',
    });
    expect(request_mock).toHaveBeenCalledWith('/identityhub/v1/sync/records/failures', {
      params: { sync_record_code: 'syn_x', sort_by: 'created_at', descending: 'desc' },
    });
  });
});
