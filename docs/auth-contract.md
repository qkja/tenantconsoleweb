# 认证接口契约（交付 authnexussvr）

> **本文件已按重设计整体改写**（原「登录账号 = 租户 `domain`（7 位数字）」的模型已作废）。
> 权威来源是 `openspec/changes/redesign-tenant-identity-model/` 下的 `api-design.md` §2.4、
> `contract-design.md` §4.4、以及定稿契约 `drafts/openplatformsvr/api/authnexus/v1/**`。
> **本文件只是给前端的落地摘要；一旦冲突，以 `openspec/` 为准。**
>
> 前端用 MSW（`src/mocks/handlers/auth.ts`）按本文档实现，后端落地后只需关 mock + 改 baseURL。

## 模型

**三域各自独立登录** —— 没有「登录后再选企业」这一步：

| 域 | 路径 | 登录凭证 | 说明 |
| --- | --- | --- | --- |
| 成员 | `POST /api/authnexus/v1/member/login` | `name`（`users.name`） | 请求体**必须带 `directory_code`**（`name` 仅在目录域内唯一） |
| 租户管理员 | `POST /api/authnexus/v1/tenant/login` | `name`（`tenant_admins.name`） | 请求体**不带 `tenant_code`**，租户归属由账号本身决定 |
| 平台管理员 | `POST /api/authnexus/v1/platform/login` | `name`（`platform_users.name`） | 平台域，无租户归属 |

**登录凭证一律是「名称」** —— 不再有任一主体用手机号登录。原 `login_account`（手机号）字段**已删除**；
手机号 / 邮箱是**联系字段**，不做唯一约束，不承担任何登录职能。

**名称可改，改名即换登录凭证**：改名后旧名称登录失败、新名称生效，且**不吊销已有会话**（决策 D26 ——
会话按 `*_code` 关联，不冗余名称；已签发会话每次校验都读得到最新名称）。**改名只影响下一次登录**。
> 与**改密**的区别：改密 **MUST** 吊销该身份的全部其他有效会话（凭证本身变了）。

**登录前置校验**（任一不满足即拒绝）：
- 账号 `status = enable`；
- 账号未锁定（`is_locked = false`）；
- **member / tenant 两域额外校验所属租户 `enable`** —— 租户停用时成员与租户管理员一律无法登录。
  平台管理员**不受此约束**（平台域无租户）。

## Token 与存储

| 项 | 要求 |
| --- | --- |
| access_token | JWT，**仅存前端内存**（Zustand 非持久化），`Authorization: Bearer` 传递 |
| refresh_token | **见下方「待裁决」** |
| 页面刷新 | 前端调对应域的 `/refresh` 重建会话 |
| 租户头 | 网关从 token claims 派生 `t-head-tenantId`，**忽略客户端裸传头** |

**session 载荷**（`TokenData` + 域的附加字段，`snake_case`）：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| access_token | string | 访问令牌 |
| refresh_token | string | 刷新令牌（**传输方式待裁决，见下**） |
| expires_in | int64 | 有效期（秒） |
| token_type | string | 固定 `Bearer` |
| tenant_code | string | **仅 tenant 域返回**；登录后所属租户 code |
| must_change_password | bool | **三域均返回** —— 是否须强制改密（首登引导） |

## ⚠️ 待裁决：`refresh_token` 的传输与存放方式

**冲突**：定稿契约把 `refresh_token` 放在**请求体**里，且标记为 `required`：

- `POST /api/authnexus/v1/{member,tenant,platform}/refresh` → Req `{ refresh_token }`（`required`）
- `POST /api/authnexus/v1/{member,tenant,platform}/logout` → Req `{ refresh_token }`（`required`，待吊销的令牌）

（见 `api-design.md` §2.4 三域同形；`drafts/openplatformsvr/api/authnexus/v1/tenant.api:31-46`）

而本仓库既有的**安全硬性要求**是「refresh token 为 **httpOnly Cookie**，前端不可读、不落 localStorage」
（见 `CLAUDE.md` §安全硬性要求）。前端读不到 Cookie，就**无法**把该字段放进请求体。

**两种收口方式，需裁决**：

1. **网关侧豁免（推荐）**：`/refresh` 与 `/logout` 两条路由由网关读 httpOnly Cookie 填充 `refresh_token`
   后再转发 —— 即契约里的 `required` 对这两条路由不适用。**前端保持现状不动。**
2. **前端持有**：前端保存 refresh_token 并放进请求体。**代价**：要跨页面刷新存活就只能落盘
   （localStorage / sessionStorage），而本仓库明令禁止 —— 会把 XSS 升级为租户越权。

**当前实现取方式 1**：`src/api/auth.ts` 的 `refresh_session()` / `logout()` **不发送** `refresh_token` 体。
因此 **§5.1 联调前，`authnexussvr` + 网关必须落地方式 1**；否则 `/refresh` 会因 `required` 校验失败（业务码 `1002`），
`/logout` 无法吊销任何会话。**这是 §4.5 / §5.1 的阻塞项。**

## 接口

统一信封 `{code, msg, data}`；`code` 为字符串，`"0"` 表成功。业务错误走 **HTTP 200**。

以 tenant 域为例（member / platform 域路径同形，替换前缀即可）：

| # | 方法 | 路径 | 请求 | 成功 data | 中间件 |
| --- | --- | --- | --- | --- | --- |
| 1 | POST | `/api/authnexus/v1/tenant/login` | `{name, password}` | `{TokenData, tenant_code, must_change_password}` | `Tracing` |
| 2 | POST | `/api/authnexus/v1/tenant/refresh` | `{refresh_token}`（待裁决） | `TokenData` | `Tracing` |
| 3 | POST | `/api/authnexus/v1/tenant/logout` | `{refresh_token}`（待裁决） | `{}` | `Tracing` |
| 4 | PUT | `/api/authnexus/v1/tenant/password` | `{old_password, new_password}` | `{}` | `Tracing,Auth,TenantAdminScope,OperationLog` |

> **tenant 域无 `GetProfile`** —— 租户管理员资料走 `tenantmanager` 的 `/me` 与 `/me/admin`（自助）。

**密码内容约束本版不做**：`new_password` 只校验 `required`，长度 / 字符类规则由**二期密码策略页面**
落地，以免静态约束与后续可配策略冲突。

## 登录状态（authnexussvr，三张表）

三域各一张，**一律以 `*_code` 关联，不用名称** —— 名称可改，用名称会让改名后的旧会话悬空：

| 集合 | 关联键 | 归属 |
| --- | --- | --- |
| `tenant_login_states` | `tenant_admin_code`（`tnu_`） | 租户管理员 |
| `user_login_states` | `user_code`（`usr_`） | 成员 |
| `platform_login_states` | `platform_user_code`（`pfu_`） | 平台管理员 |

- 存 **refresh token 哈希**，不存明文；refresh 时**轮换**哈希与 `expires_at`。
- logout / 改密 / 强制下线 = 对应行 `status → revoked`（refresh 校验即拒）。
- **改名不吊销会话**（D26）；改密则 MUST 吊销该身份的**其他**有效会话。
- **租户状态不再存快照**：随 `VerifyCredential` 实时返回（原 `TenantRef` 集合已删）。

## 错误码

错误码是 **`gobase` 的封闭集合**，禁止业务自定义新码；分档规则见 `tasks.md` §4.1.1
（一服务 1000 个码，1000–2000 为公共段）。前端**不擅自造码**。

## 前端判定顺序（`src/api/client.ts` 已收敛）

```
429 且非 JSON            → RateLimitError
非 200 + JSON {code,msg} → TransportError
code !== "0"（含 200）   → BizError
401 / code 1004          → 单飞 /refresh 后重试一次，失败抛 AuthExpired → 跳登录
```
