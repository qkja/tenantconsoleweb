# 后端待补接口清单（前端联调阻塞项）

> 前端按真实网关路由（openplatformsvr `internal/handler/routes.go` + `internal/types/types.go`）核对。
> 标注 **Mock** 的接口当前由 MSW 提供数据，后端补齐后切真实。
> 更新于 2026-08-27：认证/用户/租户后端正在按 `feature-20260830-qkj` 分支实施。

## 认证（authnexussvr —— 从零实现中）

| 接口 | 现状 | 契约 |
|---|---|---|
| `POST /authnexus/v1/auth/login` | 实施中（账号=租户 domain） | `docs/auth-contract.md` |
| `POST /authnexus/v1/auth/refresh` | 实施中（httpOnly cookie → 网关转发 refresh_token） | 同上 |
| `POST /authnexus/v1/auth/logout` | 实施中 | 同上 |
| `GET /authnexus/v1/auth/profile` | 实施中 | 同上 |
| `POST /authnexus/v1/auth/change-password` | 实施中 | 同上 |
| `POST /authnexus/v1/user/set-password` | 实施中（重置成员密码） | 同上 |
| `POST /authnexus/v1/auth/set-admin-password` | 实施中（R4：租户管理员初始化/重置） | 同上 |
| 登录状态两张表 | 实施中 | `tenant_login_state` / `user_login_state` |

> 已删除：`select-tenant`（无多企业概念，登录账号即 domain）。前端当前 **Mock**（admin/admin123）。

## identityhubsvr

| 缺失 | 说明 | 状态 |
|---|---|---|
| `ListUser` / `SearchUser` | proto 已加（ListUserReq/SearchUserReq + avatar）；仓储已有 List/ListByOrg | **实施中** |
| `EnableUser` / `DisableUser` | 实体有 Enable()/Disable() 但未暴露 | 待定 |
| `ListSecurityGroup` | 安全组仅 Create/Update/Get/Delete | **Mock** |
| 用户-组织关系 | `SetPrimaryOrg`/`AddSecondaryOrg`/`ListUserByOrg` 文档有、proto 无 | 待定（见阶段 E） |
| 安全组成员绑定 | 完全缺失 | 待定 |

## tenantmanagersvr（编译失败 → 修复中）

| 接口 | 现状 | 状态 |
|---|---|---|
| 编译 6 错（gobase 错误变量去括号、GetTenantReq getter、recovery.go） | 修复中 | **实施中** |
| `PUT /tenant/update`（UpdateTenant） | proto 已加（按 domain 寻址） | **实施中** |
| 租户管理员 `admins` 元数据 | proto 已加（TenantAdminInfo） | **实施中** |
| `GET /tenant/get` | 前端已改 `?domain=` 寻址（对齐 proto） | 待后端修复 |

> 前端企业信息页当前 **Mock**。

## 切真实联调方式

1. 后端补齐后，前端关 mock：`npm run dev`（不带 `--mode mock`）
2. `vite.config.ts` 代理 `/api → http://localhost:8888` 已就位
3. `src/api/*` 契约不变（路由/字段已按真实核对）
