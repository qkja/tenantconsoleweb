import { afterEach, describe, expect, it, vi } from 'vitest';
import { add_admin, get_tenant, list_admins, set_admin_status } from './tenant';

interface Call {
  url: string;
  init?: RequestInit;
}

function mock_fetch_ok(body?: unknown): Call[] {
  const calls: Call[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ url: String(input), init });
      return {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ code: '0', msg: '', data: body ?? null }),
      } as unknown as Response;
    }),
  );
  return calls;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('tenant api（企业信息 + 管理员管理 §2.2）', () => {
  it('get_tenant 按 domain 查询', async () => {
    const calls = mock_fetch_ok({ id: 'x', domain: '1000001' });
    await get_tenant('1000001');
    expect(calls[0].url).toContain('/tenantmanager/v1/tenant/get');
    expect(calls[0].url).toContain('domain=1000001');
  });

  it('list_admins GET，不携带 domain（网关从 claims 派生）', async () => {
    const calls = mock_fetch_ok([{ account: '1000001', displayName: '张伟', status: 'enable' }]);
    const admins = await list_admins();
    expect(calls[0].url).toContain('/tenantmanager/v1/tenant/admins');
    expect(calls[0].init?.method).toBe('GET');
    expect(calls[0].url).not.toContain('domain=');
    expect(admins[0].account).toBe('1000001');
  });

  it('add_admin POST 提交 camelCase body', async () => {
    const calls = mock_fetch_ok();
    await add_admin({ account: 'admin2', displayName: '李四', password: 'Pass@12345' });
    expect(calls[0].url).toContain('/tenantmanager/v1/tenant/admins/add');
    expect(calls[0].init?.method).toBe('POST');
    expect(JSON.parse(String(calls[0].init?.body))).toEqual({
      account: 'admin2',
      displayName: '李四',
      password: 'Pass@12345',
    });
  });

  it('set_admin_status PUT 提交 {account, status}', async () => {
    const calls = mock_fetch_ok();
    await set_admin_status({ account: 'admin2', status: 'disable' });
    expect(calls[0].url).toContain('/tenantmanager/v1/tenant/admins/status');
    expect(calls[0].init?.method).toBe('PUT');
    expect(JSON.parse(String(calls[0].init?.body))).toEqual({ account: 'admin2', status: 'disable' });
  });
});
