import { AuthExpiredError, BizError, RateLimitError, TransportError } from '@/api/errors';
import type { ApiEnvelope } from '@/api/envelope';
import { use_scope } from '@/stores/scope';
import { use_session } from '@/stores/session';
import type { SessionPayload } from '@/types/auth';

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';
const REFRESH_PATH = '/authnexus/v1/auth/refresh';
const DEFAULT_TIMEOUT_MS = 15_000;

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /** 序列化为 JSON body（POST/PUT/DELETE）。 */
  body?: unknown;
  /** 拼接到 query string（GET/DELETE；key 用后端 form 标签名）。 */
  params?: object;
  headers?: Record<string, string>;
  timeout_ms?: number;
  /** 刷新请求自身置 true，避免递归。 */
  skip_auth_refresh?: boolean;
}

// 单飞刷新：并发 401 只触发一次 /refresh，其余请求复用同一个 promise。
let refresh_promise: Promise<string | null> | null = null;

function is_json_response(response: Response): boolean {
  const content_type = response.headers.get('content-type') ?? '';
  return content_type.includes('application/json');
}

async function do_refresh(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE}${REFRESH_PATH}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      return null;
    }
    const body = (await response.json().catch(() => null)) as ApiEnvelope<SessionPayload> | null;
    if (body == null || body.code !== '0') {
      return null;
    }
    // 刷新成功 → 重建内存会话（access_token + user + tenants）。
    use_session.getState().set_session(body.data);
    return body.data.access_token;
  } catch {
    return null;
  }
}

function refresh_access_token(): Promise<string | null> {
  if (refresh_promise == null) {
    refresh_promise = do_refresh().finally(() => {
      refresh_promise = null;
    });
  }
  return refresh_promise;
}

/**
 * 统一请求头注入：认证 + t-head-* 作用域头。
 * 业务代码不得手写这些头 —— 全部收敛于此，防串租户。
 */
function build_headers(extra?: Record<string, string>): Headers {
  const headers = new Headers(extra);
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  const { access_token, user } = use_session.getState();
  if (access_token != null) {
    headers.set('Authorization', `Bearer ${access_token}`);
  }
  if (user != null) {
    headers.set('t-head-userId', user.user_id);
  }

  const { tenant_id, ui_language } = use_scope.getState();
  if (tenant_id != null) {
    headers.set('t-head-tenantId', tenant_id);
  }
  if (ui_language != null) {
    headers.set('t-head-tenantLanguage', ui_language);
    headers.set('t-head-tenantUILanguage', ui_language);
  }
  return headers;
}

function build_url(path: string, params?: object): string {
  if (params == null) {
    return path;
  }
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query === '' ? path : `${path}?${query}`;
}

async function parse_body(response: Response): Promise<ApiEnvelope<unknown>> {
  const body = (await response.json().catch(() => null)) as ApiEnvelope<unknown> | null;
  if (body == null || typeof body !== 'object') {
    throw new TransportError(response.status, String(response.status), 'invalid response body');
  }
  return body;
}

function is_auth_expired(error: unknown): boolean {
  if (error instanceof TransportError) {
    return error.status === 401;
  }
  // gobase 1004 = 未认证（业务错误路径也可能以 200+1004 返回）。
  if (error instanceof BizError) {
    return error.code === '1004';
  }
  return false;
}

/**
 * 统一请求入口。三条路径判定顺序（收敛于此，业务层不再重复）：
 *   1. 429 且非 JSON            → RateLimitError
 *   2. 非 200 + JSON {code,msg} → TransportError
 *   3. code !== "0"（含 200）   → BizError
 *   4. 否则                     → data
 * 401/1004 自动单飞刷新并重试一次；刷新失败抛 AuthExpiredError。
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body,
    params,
    headers,
    timeout_ms = DEFAULT_TIMEOUT_MS,
    skip_auth_refresh = false,
  } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout_ms);

  try {
    const init: RequestInit = {
      method,
      credentials: 'include',
      headers: build_headers(headers),
      signal: controller.signal,
    };
    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${build_url(path, params)}`, init);

    // 路径 C：限流拒绝（纯文本，非 JSON）。
    if (response.status === 429 && !is_json_response(response)) {
      throw new RateLimitError();
    }

    const envelope = await parse_body(response);

    // 路径 B：传输/校验错误（无 data）。
    if (!response.ok) {
      throw new TransportError(
        response.status,
        String(envelope.code ?? response.status),
        envelope.msg ?? `HTTP ${response.status}`,
      );
    }

    // 路径 A：业务错误（HTTP 200 + code!="0"）。
    if (envelope.code !== '0') {
      throw new BizError(envelope.code, envelope.msg);
    }

    return envelope.data as T;
  } catch (error) {
    if (is_auth_expired(error) && !skip_auth_refresh) {
      const new_token = await refresh_access_token();
      if (new_token != null) {
        return request<T>(path, { ...options, skip_auth_refresh: true });
      }
      throw new AuthExpiredError();
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
