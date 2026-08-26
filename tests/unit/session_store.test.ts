import { beforeEach, describe, expect, it } from 'vitest';
import { use_session } from '@/stores/session';

const session_payload = {
  access_token: 'token',
  user: {
    user_id: 'u_1',
    username: 'admin',
    display_name: '管理员',
    scope: 'admin' as const,
    roles: ['tenant_admin'],
  },
  tenant: {
    tenant_id: 't_1',
    tenant_name: '示例科技',
    domain: '1000001',
    language: 'zh_CN' as const,
    ui_language: 'zh_CN' as const,
  },
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
    expect(state.tenant?.domain).toBe('1000001');
  });

  it('clear_session 回到初始态', () => {
    use_session.getState().set_session(session_payload);
    use_session.getState().clear_session();
    const state = use_session.getState();
    expect(state.is_authenticated).toBe(false);
    expect(state.access_token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.tenant).toBeNull();
  });
});
