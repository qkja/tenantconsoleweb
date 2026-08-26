import { create } from 'zustand';
import type { SessionPayload, SessionUser, TenantOption } from '@/types/auth';

/**
 * 会话态 —— access token 仅存内存（非持久化）。
 * 刷新页面依赖 /refresh 重建会话；refresh token 为 httpOnly Cookie，前端不可读。
 * 绝不写 localStorage（网关 CORS 全开，落盘会把 XSS 升级为租户越权）。
 */
interface SessionStore {
  access_token: string | null;
  user: SessionUser | null;
  tenants: TenantOption[];
  is_authenticated: boolean;

  set_session: (payload: SessionPayload) => void;
  set_user: (user: SessionUser) => void;
  clear_session: () => void;
}

const initial_state = {
  access_token: null,
  user: null,
  tenants: [],
  is_authenticated: false,
};

export const use_session = create<SessionStore>((set) => ({
  ...initial_state,

  set_session: ({ access_token, user, tenants }) =>
    set({ access_token, user, tenants, is_authenticated: true }),

  set_user: (user) => set({ user }),

  clear_session: () => set(initial_state),
}));
