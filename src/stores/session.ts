import { create } from 'zustand';
import type { SessionPayload } from '@/types/auth';

/**
 * 会话态 —— access token 仅存内存（非持久化）。
 * 刷新页面依赖 /refresh 重建会话；refresh token 为 httpOnly Cookie，前端不可读。
 * 绝不写 localStorage（网关 CORS 全开，落盘会把 XSS 升级为租户越权）。
 */
interface SessionStore {
  access_token: string | null;
  tenant_code: string | null;
  must_change_password: boolean;
  is_authenticated: boolean;

  set_session: (payload: SessionPayload) => void;
  set_access_token: (token: string) => void;
  clear_session: () => void;
}

const initial_state = {
  access_token: null,
  tenant_code: null,
  must_change_password: false,
  is_authenticated: false,
};

export const use_session = create<SessionStore>((set) => ({
  ...initial_state,

  set_session: ({ access_token, tenant_code, must_change_password }) =>
    set({ access_token, tenant_code, must_change_password, is_authenticated: true }),

  // 刷新接口只返回 TokenData（不含 tenant_code/must_change_password），仅更新令牌。
  set_access_token: (access_token) => set({ access_token }),

  clear_session: () => set(initial_state),
}));
