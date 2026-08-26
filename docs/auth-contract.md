# 认证接口契约（交付 authnexussvr）

> 前端先行契约。authnexussvr 当前为空壳（2 文件、无 `feature-20260830-qkj` 分支）。
> 前端用 MSW（`src/mocks/handlers/auth.ts`）按本文档实现，后端落地后只需关 mock + 改 baseURL。

## 模型

租户认证（管理员，scope=admin）与用户认证（成员，scope=member）**共用同一套登录**，由后端判定 scope。一账号可属多租户 → 「选择企业」页。

```
账号 + 密码
  → POST /login → 多企业则返回 login_ticket + tenants[]；单企业直接返回 session
  → 多企业：POST /select-tenant {login_ticket, tenant_id} → session
  → 控制台：scope=admin 可进；scope=member 被守卫挡在管理后台外
```

## Token 与存储（硬性安全要求）

| 项            | 要求                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| access_token  | JWT，**仅存前端内存**（Zustand 非持久化），Authorization Bearer 传递                                             |
| refresh token | 网关下发 **httpOnly + Secure + SameSite=Lax Cookie**；前端不可读、不落 localStorage                              |
| 页面刷新      | 前端调 `/refresh`（携带 cookie）重建会话                                                                         |
| CSRF          | cookie 认证类状态变更接口需 CSRF 防护（前端契约要求后端实现）                                                    |
| 租户头        | 认证落地后网关须从 token claims 派生 `t-head-tenantId`，**忽略客户端裸传头**（现 `tenantmiddleware` 无条件信任） |

**claims**：`{ tenant_id, domain?, user_id, username, scope: "admin"|"member", roles[], exp }`

## 接口

统一信封 `{code, msg, data}`；`code` 为字符串，`"0"` 表成功。业务错误走 **HTTP 200**。

| #   | 方法 | 路径                                     | 请求                           | 成功 data                                              |
| --- | ---- | ---------------------------------------- | ------------------------------ | ------------------------------------------------------ |
| 1   | POST | `/api/authnexus/v1/auth/login`           | `{account, password}`          | 单企业 `{session}`；多企业 `{login_ticket, tenants[]}` |
| 2   | POST | `/api/authnexus/v1/auth/select-tenant`   | `{login_ticket, tenant_id}`    | `{session}`                                            |
| 3   | POST | `/api/authnexus/v1/auth/refresh`         | （cookie）                     | `{session}`                                            |
| 4   | POST | `/api/authnexus/v1/auth/logout`          | —                              | `{}`                                                   |
| 5   | GET  | `/api/authnexus/v1/auth/profile`         | —                              | `{user, permissions[]}`                                |
| 6   | POST | `/api/authnexus/v1/auth/change-password` | `{old_password, new_password}` | `{}`                                                   |
| 7   | POST | `/api/authnexus/v1/user/set-password`    | `{user_id, new_password}`      | `{}`                                                   |

**session 形状**（snake_case）：

```json
{
  "session": {
    "access_token": "<jwt>",
    "user": {
      "user_id": "u_001",
      "username": "admin",
      "display_name": "管理员",
      "scope": "admin",
      "roles": ["tenant_admin"]
    },
    "tenants": [
      {
        "tenant_id": "t_001",
        "tenant_name": "示例科技",
        "domain": "1000001",
        "language": "zh_CN",
        "ui_language": "zh_CN"
      }
    ]
  }
}
```

**TenantOption 字段**：`tenant_id`、`tenant_name`、`domain`（7 位数字唯一码）、`language`（内容语言）、`ui_language`（UI 语言）。

## 登录状态存储（认证服务两张表，用户指令）

认证服务须**两张表分别记录租户（管理员）与用户（成员）的登录状态**。
refresh token 校验、单端登录、强制下线、登录审计都查表 —— 不能只用无状态 JWT（服务端无法吊销）。

### 1. `tenant_login_state` —— 租户（管理员）登录状态

| 字段                  | 说明                             |
| --------------------- | -------------------------------- |
| tenant_id             | 租户 ID（复合主键之一）          |
| account               | 管理员账号                       |
| login_ticket          | 多企业选择阶段临时票据（可空）   |
| refresh_token_hash    | refresh token 哈希（不存明文）   |
| login_at / expires_at | 登录 / 过期时间                  |
| ip / user_agent       | 登录设备（审计）                 |
| status                | `active` / `expired` / `revoked` |

### 2. `user_login_state` —— 用户（成员）登录状态

| 字段                  | 说明                             |
| --------------------- | -------------------------------- |
| user_id               | 成员 ID（复合主键之一）          |
| tenant_id             | 所属租户                         |
| refresh_token_hash    | refresh token 哈希               |
| login_at / expires_at | 登录 / 过期时间                  |
| ip / user_agent       | 登录设备                         |
| status                | `active` / `expired` / `revoked` |

**设计要点**：

- **分表原因**：scope 不同（admin/member）、生命周期与吊销维度不同；管理员被踢出企业与成员离职互不干扰
- 同 `(user_id, tenant_id)` 新登录是否作废旧会话（单端/多端）由后端策略定
- logout / 改密 / 强制下线 = 对应行 `status → revoked`（refresh 校验即拒）
- MSW 契约不落地这两张表（Mock 无状态），仅作前端联调；真实实现以本设计为准

## 错误码（gobase 封闭集合，禁止业务自定义新码）

| code | 含义       | 场景                                      |
| ---- | ---------- | ----------------------------------------- |
| 1002 | 参数无效   | 缺字段、格式错                            |
| 1003 | 租户不存在 | select-tenant 选中无效租户                |
| 1004 | 未认证     | 账号/密码错误、token 过期、无有效 refresh |
| 1005 | 权限拒绝   | member 访问管理接口、租户停用             |
| 1007 | 已存在     | 注册类已存在                              |

**待定（须后端在 gobase 新增 5000 段）**：密码错误次数超限、验证码错误、账号锁定等语义。前端不擅自造码，契约评审后再定。

## 前端判定顺序（client.ts 已收敛）

```
429 且非 JSON           → RateLimitError
非 200 + JSON {code,msg} → TransportError
code !== "0"（含 200）  → BizError
401 / code 1004          → 单飞 /refresh 后重试一次，失败抛 AuthExpired → 跳登录
```
