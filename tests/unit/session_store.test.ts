import { beforeEach, describe, expect, it } from 'vitest';
import { use_session } from '@/stores/session';

const session_payload = {
  access_token: 'token',
  refresh_token: 'refresh',
  expires_in: 7200,
  token_type: 'Bearer',
  tenant_code: 'tnt_01HX8ZK3M9QF2V7N4B6TCD1RWP',
  must_change_password: false,
};

describe('session store', () => {
  beforeEach(() => {
    use_session.getState().clear_session();
  });

  it('初始未认证', () => {
    expect(use_session.getState().is_authenticated).toBe(false);
    expect(use_session.getState().access_token).toBeNull();
  });

  it('set_session 写入会话并标记已认证', () => {
    use_session.getState().set_session(session_payload);
    const state = use_session.getState();
    expect(state.is_authenticated).toBe(true);
    expect(state.access_token).toBe('token');
    expect(state.tenant_code).toBe('tnt_01HX8ZK3M9QF2V7N4B6TCD1RWP');
  });

  it('set_access_token 仅更新令牌', () => {
    use_session.getState().set_session(session_payload);
    use_session.getState().set_access_token('new-token');
    expect(use_session.getState().access_token).toBe('new-token');
    expect(use_session.getState().tenant_code).toBe('tnt_01HX8ZK3M9QF2V7N4B6TCD1RWP');
  });

  it('clear_session 回到初始态', () => {
    use_session.getState().set_session(session_payload);
    use_session.getState().clear_session();
    const state = use_session.getState();
    expect(state.is_authenticated).toBe(false);
    expect(state.access_token).toBeNull();
    expect(state.tenant_code).toBeNull();
  });
});
