/** 认证相关类型 —— identityhub/authnexus 契约（snake_case）。 */

export type AuthScope = 'admin' | 'member';

export type UILanguage = 'zh_CN' | 'en_US';

/** 登录会话所属租户 —— 单租户（无多企业概念，登录账号即租户 domain）。 */
export interface SessionTenant {
  tenant_id: string;
  tenant_name: string;
  /** 7 位数字唯一码，登录账号。 */
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
  tenant: SessionTenant;
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
