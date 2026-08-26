import { describe, expect, it } from 'vitest';
import {
  AuthExpiredError,
  BizError,
  RateLimitError,
  TransportError,
  is_auth_expired_error,
  is_biz_error,
} from '@/api/errors';

describe('errors', () => {
  it('BizError 携带业务码', () => {
    const error = new BizError('4002', '业务失败');
    expect(error.code).toBe('4002');
    expect(error.name).toBe('BizError');
    expect(is_biz_error(error)).toBe(true);
  });

  it('TransportError 携带 HTTP 状态', () => {
    const error = new TransportError(400, '1002', '参数无效');
    expect(error.status).toBe(400);
    expect(error.code).toBe('1002');
  });

  it('RateLimitError 携带重试间隔', () => {
    const error = new RateLimitError();
    expect(error.retry_after_ms).toBeGreaterThan(0);
  });

  it('AuthExpiredError 可被守卫识别', () => {
    const error = new AuthExpiredError();
    expect(is_auth_expired_error(error)).toBe(true);
  });

  it('普通 Error 不是业务错误', () => {
    expect(is_biz_error(new Error('x'))).toBe(false);
  });
});
