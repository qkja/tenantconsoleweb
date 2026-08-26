/**
 * 错误类型 —— 对应后端三条错误路径：
 *   A 业务错误  = BizError        （HTTP 200 + code!="0"，网关原样透传）
 *   B 传输错误  = TransportError  （非 200 + JSON {code,msg}，无 data）
 *   C 限流拒绝  = RateLimitError  （429 + 纯文本 "too many requests"）
 *   （附）会话过期 = AuthExpiredError（401 自动刷新失败后抛出）
 */

/** 路径 A：业务错误。code 为 gobase 业务码字符串（"0" 表成功）。 */
export class BizError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'BizError';
    this.code = code;
  }
}

/** 路径 B：传输/校验错误。 */
export class TransportError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'TransportError';
    this.status = status;
    this.code = code;
  }
}

/** 路径 C：限流拒绝（HTTP 429 + 非 JSON 纯文本）。 */
export class RateLimitError extends Error {
  readonly retry_after_ms: number;

  constructor(message = 'too many requests', retry_after_ms = 1000) {
    super(message);
    this.name = 'RateLimitError';
    this.retry_after_ms = retry_after_ms;
  }
}

/** 会话过期：401 自动刷新失败，前端应清理会话并跳登录页。 */
export class AuthExpiredError extends Error {
  constructor(message = 'session expired') {
    super(message);
    this.name = 'AuthExpiredError';
  }
}

export function is_biz_error(error: unknown): error is BizError {
  return error instanceof BizError;
}

export function is_auth_expired_error(error: unknown): error is AuthExpiredError {
  return error instanceof AuthExpiredError;
}
