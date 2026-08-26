import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { use_session } from '@/stores/session';

/** 鉴权守卫：未登录 → 跳 /login 并记录来源，登录后回跳。 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const is_authenticated = use_session((state) => state.is_authenticated);
  const location = useLocation();

  if (!is_authenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

/** 已登录访问 /login → 直接进控制台。 */
export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const is_authenticated = use_session((state) => state.is_authenticated);
  if (is_authenticated) {
    return <Navigate to="/overview" replace />;
  }
  return children;
}
