/** 认证相关类型 —— identityhub/authnexus 契约（snake_case）。 */

export type AuthScope = 'admin' | 'member';

export type UILanguage = 'zh_CN' | 'en_US';

/** 账号可访问的一个租户（企业），用于多企业选择。 */
export interface TenantOption {
  tenant_id: string;
  tenant_name: string;
  /** 7 位数字唯一码，Directory/User 双键作用域的第二键。 */
  domain: string;
  language: UILanguage;
  ui_language: UILanguage;
}

export interface SessionUser {
  user_id: string;
  username: string;
  display_name: string;
  scope: AuthScope;
  roles: string[];
}

/** 登录 / 刷新成功后的会话负载。 */
export interface SessionPayload {
  access_token: string;
  user: SessionUser;
  tenants: TenantOption[];
}

/** token claims（解码后）—— 仅内存使用，不落盘。 */
export interface TokenClaims {
  tenant_id: string;
  domain?: string;
  user_id: string;
  username: string;
  scope: AuthScope;
  roles: string[];
  exp: number;
}
