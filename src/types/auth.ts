/** 认证相关类型 —— authnexus 契约（snake_case）。 */

/** 界面语言（应用内字典键，antd locale 同源）。 */
export type UILanguage = 'zh_CN' | 'en_US';

/** 租户默认业务语言（`TenantInfo.language` 值域，落库）。 */
export type TenantLanguage = 'zh-CN' | 'en-US';

/** 公共 TokenData —— 三域登录 / 刷新共用（contract-design §2.4）。 */
export interface TokenData {
  access_token: string;
  refresh_token: string;
  /** 有效期（秒）。 */
  expires_in: number;
  /** 固定 `Bearer`。 */
  token_type: string;
}

/** 租户管理员登录 / 刷新成功后的会话负载（仅内存，不落盘）。 */
export interface SessionPayload extends TokenData {
  tenant_code: string;
  /** 首次登录须改密。 */
  must_change_password: boolean;
}

/** 界面语言 → 请求头 `t-head-tenantUILanguage` 值（`zh_CN` → `zh-CN`）。 */
export function to_header_ui_language(language: UILanguage): string {
  return language === 'zh_CN' ? 'zh-CN' : 'en-US';
}
