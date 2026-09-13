import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BizError, RateLimitError, TransportError } from '@/api/errors';
import { request } from '@/api/client';
import { use_scope } from '@/stores/scope';
import { use_session } from '@/stores/session';

function json_response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function plain_response(text: string, status = 200): Response {
  return new Response(text, { status, headers: { 'content-type': 'text/plain' } });
}

const session_payload = {
  access_token: 'new-token',
  refresh_token: 'refresh-x',
  expires_in: 7200,
  token_type: 'Bearer',
  tenant_code: 'tnt_01HX8ZK3M9QF2V7N4B6TCD1RWP',
  must_change_password: false,
};

describe('api client request —— 三条错误路径', () => {
  beforeEach(() => {
    use_session.getState().clear_session();
    use_scope.getState().clear_scope();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('成功：code="0" 解包 data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(json_response({ code: '0', msg: '', data: { ok: true } })),
    );
    const result = await request<{ ok: boolean }>('/foo');
    expect(result.ok).toBe(true);
  });

  it('路径 A：HTTP 200 但 code!="0" → BizError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(json_response({ code: '4002', msg: '业务失败', data: {} })),
    );
    await expect(request('/foo')).rejects.toBeInstanceOf(BizError);
  });

  it('路径 B：非 200 + JSON {code,msg} → TransportError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(json_response({ code: '1002', msg: '参数无效' }, 400)),
    );
    await expect(request('/foo')).rejects.toBeInstanceOf(TransportError);
  });

  it('路径 C：429 + 纯文本 → RateLimitError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(plain_response('too many requests', 429)));
    await expect(request('/foo')).rejects.toBeInstanceOf(RateLimitError);
  });

  it('注入 Authorization + t-head-* 头（tenantId / tenantUILanguage）', async () => {
    use_session.getState().set_session({ ...session_payload, access_token: 'token-x' });
    use_scope
      .getState()
      .set_tenant({ tenant_code: 'tnt_01HX8ZK3M9QF2V7N4B6TCD1RWP', ui_language: 'zh_CN' });
    const fetch_mock = vi.fn().mockResolvedValue(json_response({ code: '0', msg: '', data: null }));
    vi.stubGlobal('fetch', fetch_mock);

    await request('/foo');

    const [, init] = fetch_mock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer token-x');
    expect(headers.get('t-head-tenantId')).toBe('tnt_01HX8ZK3M9QF2V7N4B6TCD1RWP');
    expect(headers.get('t-head-tenantUILanguage')).toBe('zh-CN');
    expect(headers.get('t-head-userId')).toBeNull();
  });

  it('GET 拼接 query 参数（page/page_size）', async () => {
    const fetch_mock = vi.fn().mockResolvedValue(json_response({ code: '0', msg: '', data: null }));
    vi.stubGlobal('fetch', fetch_mock);

    await request('/foo', { params: { page: 1, page_size: 20 } });

    const [url] = fetch_mock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/foo?page=1&page_size=20');
  });

  it('401/1004 → 单飞刷新后重试一次', async () => {
    use_session.getState().set_session({ ...session_payload, access_token: 'expired' });
    const refresh_data = {
      access_token: 'new-token',
      refresh_token: 'r2',
      expires_in: 7200,
      token_type: 'Bearer',
    };
    const fetch_mock = vi
      .fn()
      .mockResolvedValueOnce(json_response({ code: '1004', msg: '未认证', data: {} }))
      .mockResolvedValueOnce(json_response({ code: '0', msg: '', data: refresh_data }))
      .mockResolvedValueOnce(json_response({ code: '0', msg: '', data: null }));
    vi.stubGlobal('fetch', fetch_mock);

    await request('/foo');

    // 业务失败 → /refresh → 重试 /foo
    expect(fetch_mock).toHaveBeenCalledTimes(3);
    expect(use_session.getState().access_token).toBe('new-token');
  });

  it('刷新失败 → AuthExpiredError', async () => {
    use_session.getState().set_session({ ...session_payload, access_token: 'expired' });
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(json_response({ code: '1004', msg: '未认证', data: {} }))
        .mockResolvedValueOnce(plain_response('too many requests', 429)),
    );

    const { AuthExpiredError } = await import('@/api/errors');
    await expect(request('/foo')).rejects.toBeInstanceOf(AuthExpiredError);
  });
});
