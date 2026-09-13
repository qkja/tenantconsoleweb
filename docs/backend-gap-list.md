# 后端待补接口清单（前端联调阻塞项）

> **已按重设计整体改写**（原「账号 = 租户 `domain`」「安全组」等口径随 proto 重做一并作废）。
> 权威来源：`openspec/changes/redesign-tenant-identity-model/` 的 `tasks.md` §4 / §5 与 `drafts/**`。
> 前端已按定稿契约实现；下表是**为跑通 §5 对接，后端必须先落地**的部分。
> 更新于 2026-09-13。

## 1. 阻塞项（不落地则前端必挂）

| # | 事项 | 归属 | 阻塞什么 |
| --- | --- | --- | --- |
| B1 | **`refresh_token` 传输方式裁决**（网关读 httpOnly Cookie 填充，还是前端持有）——见 `docs/auth-contract.md` §待裁决 | `openplatformsvr` + `authnexussvr` | `/refresh`、`/logout`。取方式 1 则两条路由豁免 `required` |
| B2 | **语言接线**：`TenantScope` / `TenantAdminScope` 读 `t-head-tenantLanguage` / `t-head-tenantUILanguage` 写入 `tenant.WithInfo` | `openplatformsvr`（`tasks.md` §4.7.1） | 错误 `msg` 的语言回退 —— 现只写 `TenantID`，下游一律回退英文 |
| B3 | **路由前缀去 `svr`**：`platformsvr` → `platform`（目录 / `group` / URL 三处同步） | `openplatformsvr`（§4.7.2） | 平台域全部接口 404 |
| B4 | **三领域名登录落地**：`/authnexus/v1/{member,tenant,platform}/login`，凭证 = `name` | `authnexussvr` + 网关（§4.5） | 登录本身 |
| B5 | **登录响应返回 `must_change_password`**（三域对称） | `authnexussvr`（§4.5.3） | 首登强制改密引导 |

## 2. 各服务需实现/改造的接口

### `authnexussvr`（§4.5）

| 事项 | 状态 |
| --- | --- |
| 三登录状态集合改名：`tenant_login_states` / `user_login_states` / `platform_login_states` | 待实现 |
| 三集合一律以 `*_code` 关联（`tenant_admin_code` / `user_code` / `platform_user_code`），**不用名称** | 待实现 |
| 删 4 个越界集合及其 domain / repo / logic / handler（`TenantAdmin` / `UserCred` / `PlatformUser` / `TenantRef`） | 待实现（§3.1） |
| 删 `tenant_login_states` 的 `account` / `login_account` 旧字段与索引 `idx_tenant_account` | 待实现（§3.5b） |
| 租户状态**随 `VerifyCredential` 返回**，不再存快照 | 待实现 |
| 登录前置校验含「租户启用 + 账号未锁定」 | 待实现 |

### `tenantmanagersvr`（§4.2）

| 事项 | 状态 |
| --- | --- |
| 三集合重写：`tenants` / `tenant_admins` / `tenant_roles` + 索引 | 待实现 |
| **建租户四步初始化**（建租户 → 建管理员 → 建「超级管理员」角色 → 绑定），**同事务、不跨服务** | 待实现 |
| 按名称登录：`name` 在**租户管理员范围内全局唯一**、可改、改名即换凭证 | 待实现 |
| 锁定：`max_login_failures` + `login_fail_window` + `login_fail_window_unit` 三者联动 | 待实现 |
| 兜底约束：任一时刻至少一个 `enable` 且绑定超级管理员角色的管理员 | 待实现 |
| 删 `CreateTenantResp.admin_login_account` 及其类型 / 转换 | 待实现（§3.4） |
| 删 `tenant_admins.login_account` 与 `tenant.domain` 的全部代码路径 | 待实现（§3.3） |
| 删越界副本 `PlatformAccount` / `PlatformRole` | 待实现（§3.2） |

### `identityhubsvr`（§4.3）

| 事项 | 状态 |
| --- | --- |
| 集合改名 + `*_id` → `*_code` + `domain` → `directory_code` | 待实现 |
| `organizations.path` 改为 **string 物化路径**（含自身、首尾 `/`；数组方案作废） | 待实现 |
| `users` 补 `must_change_password` / `login_fail_window` / `login_fail_window_unit` | 待实现 |
| `sync_failures` 独立集合（append-only） | 待实现 |
| 用户角色：`sg_` 退役 → `uro`，**无权限点** | 待实现 |

### `platformsvr`（§4.4）

| 事项 | 状态 |
| --- | --- |
| 集合改名 + 补窗口两字段 | 待实现 |
| code 生成订正：UUID v4 → `gobase/goid.GenerateCode` | 待实现 |
| 平台角色 `permissions` → `page_codes`（权限点 = 前端页面清单，后端不得自行枚举） | 待实现 |
| 内置「超级管理员」保护硬拦（`Update` / `Delete` / `UpdateStatus` 三个口子） | 待实现 |

### `auditsvr`（§4.6）

| 事项 | 状态 |
| --- | --- |
| 两审计集合改名 | 待实现 |
| 补 `module` / `resource_code` 的**落库**（现实现会丢弃） | 待实现 |
| append-only：**无** `is_deleted`、**无** Update / Delete | 待实现 |

### `gobase`（§4.1）

| 事项 | 状态 |
| --- | --- |
| `errors/code.go` 按「一服务 1000 个码，1000–2000 为公共段」重分段 | 待实现 |
| 同步重配 `i18n/default/{zh-CN,en-US}.po`（**每个新码都要有条目**） | 待实现 |
| 语言头常量 + `GetTenantMsg` 的 `UILanguage → Language → en` 回退链 | **已就绪**（`gobase`） |

## 3. 切真实联调方式

1. 后端补齐后，前端关 mock：`npm run dev`（不带 `--mode mock`）
2. `vite.config.ts` 代理 `/api → http://localhost:8888` 已就位
3. `src/api/*` 契约不变（路由 / 字段已按 `drafts/**` 定稿核对）

## 4. §5 逐项验收（对齐 `tasks.md` §5）

- [ ] 5.1 逐接口联调：URL 前缀、入参、响应信封、错误码与 `msg` 语言
- [ ] 5.2 界面语言**逐请求下发**：相邻两次请求换语言，错误 `msg` 语言随之变，且**不需重新登录**
- [ ] 5.3 四步初始化：建租户后管理员可**立即按「租户名称」登录**
- [ ] 5.4 改名即换凭证：改名后旧名称登录失败、新名称成功、旧名称可被他人占用
- [ ] 5.4b 改名**不吊销**会话：改名时已登录的会话保持有效，且后续读到的是**新名称**
- [ ] 5.5 锁定窗口：窗口内达阈值即锁、窗口滑出后计数清零
- [ ] 5.6 停用 / 软删语义：租户停用断登录但平台仍可操作；软删后从属数据保留
- [ ] 5.7 端到端回归：关键路径走通，**无残留旧字段 / 旧 URL**
