import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { list_directory } from '@/api/directory';
import { list_organization_children } from '@/api/organization';
import { get_tenant } from '@/api/tenant';
import { list_users } from '@/api/user';
import { use_directory_list } from '@/hooks/queries/use_directory_list';
import { use_organization_children } from '@/hooks/queries/use_organization_children';
import { use_tenant_info } from '@/hooks/queries/use_tenant_info';
import { use_user_list } from '@/hooks/queries/use_user_list';

vi.mock('@/api/directory', () => ({ list_directory: vi.fn() }));
vi.mock('@/api/organization', () => ({ list_organization_children: vi.fn() }));
vi.mock('@/api/tenant', () => ({ get_tenant: vi.fn() }));
vi.mock('@/api/user', () => ({ list_users: vi.fn() }));

const directory_mock = vi.mocked(list_directory);
const organization_mock = vi.mocked(list_organization_children);
const tenant_mock = vi.mocked(get_tenant);
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
    users_mock.mockReset();
  });

  it('use_directory_list 返回 list', async () => {
    directory_mock.mockResolvedValue({
      total: 1,
      list: [
        {
          id: 'd1',
          tenant_id: 't_1',
          name: '主目录',
          domain: '1000001',
          description: '',
          created_at: '',
          updated_at: '',
        },
      ],
    });

    const { result } = renderHook(() => use_directory_list(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.[0]?.name).toBe('主目录');
  });

  it('use_organization_children 按 domain+parent 请求', async () => {
    organization_mock.mockResolvedValue({ list: [], total: 0, page: 1, page_size: 500 });

    const { result } = renderHook(() => use_organization_children('1000001', 'org_a'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(organization_mock).toHaveBeenCalledWith({
      domain: '1000001',
      parent_id: 'org_a',
      page: 1,
      page_size: 500,
    });
  });

  it('use_user_list 传 org_id 为 undefined 时展示全部', async () => {
    users_mock.mockResolvedValue({ list: [], total: 0 });

    const { result } = renderHook(() => use_user_list('1000001', null), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(users_mock).toHaveBeenCalledWith({
      domain: '1000001',
      org_id: undefined,
      page: 1,
      page_size: 500,
    });
  });

  it('use_tenant_info 仅在 tenant_id 存在时请求', async () => {
    tenant_mock.mockResolvedValue({
      id: 't_1',
      name: '示例科技',
      code: 'C1',
      domain: '1000001',
      contactName: '张伟',
      contactPhone: '',
      contactEmail: '',
      status: 'paid',
      remark: '',
      createTime: '',
      updateTime: '',
    });

    const { result } = renderHook(() => use_tenant_info('t_1'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(tenant_mock).toHaveBeenCalledWith('t_1');
    expect(result.current.data?.name).toBe('示例科技');
  });
});
