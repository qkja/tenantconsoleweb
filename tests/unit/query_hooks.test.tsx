import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { list_directory } from '@/api/directory';
import { list_organization_children } from '@/api/organization';
import { get_current_admin, get_current_tenant } from '@/api/tenant';
import { list_users } from '@/api/user';
import { use_current_admin } from '@/hooks/queries/use_current_admin';
import { use_current_tenant } from '@/hooks/queries/use_current_tenant';
import { use_directory_list } from '@/hooks/queries/use_directory_list';
import { use_organization_children } from '@/hooks/queries/use_organization_children';
import { use_user_list } from '@/hooks/queries/use_user_list';

vi.mock('@/api/directory', () => ({ list_directory: vi.fn() }));
vi.mock('@/api/organization', () => ({ list_organization_children: vi.fn() }));
vi.mock('@/api/tenant', () => ({ get_current_tenant: vi.fn(), get_current_admin: vi.fn() }));
vi.mock('@/api/user', () => ({ list_users: vi.fn() }));

const directory_mock = vi.mocked(list_directory);
const organization_mock = vi.mocked(list_organization_children);
const tenant_mock = vi.mocked(get_current_tenant);
const admin_mock = vi.mocked(get_current_admin);
const users_mock = vi.mocked(list_users);

function wrapper({ children }: { children: ReactNode }) {
  const query_client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={query_client}>{children}</QueryClientProvider>;
}

describe('query hooks', () => {
  beforeEach(() => {
    directory_mock.mockReset();
    organization_mock.mockReset();
    tenant_mock.mockReset();
    admin_mock.mockReset();
    users_mock.mockReset();
  });

  it('use_directory_list 返回 list', async () => {
    directory_mock.mockResolvedValue({
      total: 1,
      page: 1,
      page_size: 100,
      list: [
        {
          directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP',
          name: '主目录',
          type: 'local',
          description: '',
          status: 'enable',
          sync_configured: false,
          created_at: 0,
          updated_at: 0,
        },
      ],
    });

    const { result } = renderHook(() => use_directory_list(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.[0]?.name).toBe('主目录');
  });

  it('use_organization_children 按 directory_code+parent 请求', async () => {
    organization_mock.mockResolvedValue({ list: [], total: 0, page: 1, page_size: 500 });

    const { result } = renderHook(
      () => use_organization_children('dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP', 'org_01HX8ZK6R3SC4Y1G7T9VAE5NDQ'),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(organization_mock).toHaveBeenCalledWith({
      directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP',
      parent_code: 'org_01HX8ZK6R3SC4Y1G7T9VAE5NDQ',
      page: 1,
      page_size: 500,
    });
  });

  it('use_user_list 传 organization_code 为 null 时展示目录域全部', async () => {
    users_mock.mockResolvedValue({ list: [], total: 0, page: 1, page_size: 500 });

    const { result } = renderHook(() => use_user_list('dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP', null), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(users_mock).toHaveBeenCalledWith({
      directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP',
      organization_code: undefined,
      keyword: undefined,
      page: 1,
      page_size: 500,
      sort_by: 'created_at',
      descending: 'desc',
    });
  });

  it('use_current_tenant / use_current_admin 请求自助接口', async () => {
    tenant_mock.mockResolvedValue({
      tenant_code: 'tnt_01HX8ZK3M9QF2V7N4B6TCD1RWP',
      customer_name: '示例科技',
      status: 'enable',
      country_code: '+86',
      phone: '',
      email: '',
      address: '',
      contact_name: '',
      language: 'zh-CN',
      created_at: 0,
      updated_at: 0,
    });
    admin_mock.mockResolvedValue({
      tenant_admin_code: 'tnu_01HX8ZK4P1QA2W9E5R7TYC3MBN',
      name: 'admin',
      email: '',
      country_code: '',
      phone: '',
      status: 'enable',
      max_login_failures: 5,
      login_fail_window: 15,
      login_fail_window_unit: 'minute',
      failed_login_count: 0,
      is_locked: false,
      must_change_password: false,
      role_codes: [],
      role_names: [],
      is_initial: true,
      last_login_at: 0,
      created_at: 0,
      updated_at: 0,
    });

    const { result } = renderHook(() => use_current_tenant(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.customer_name).toBe('示例科技');

    const admin = renderHook(() => use_current_admin(), { wrapper });
    await waitFor(() => expect(admin.result.current.isSuccess).toBe(true));
    expect(admin.result.current.data?.name).toBe('admin');
  });
});
