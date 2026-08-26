# 后端待补接口清单（前端联调阻塞项）

> 前端按真实网关路由（openplatformsvr `internal/handler/routes.go` + `internal/types/types.go`）核对。
> 标注 **Mock** 的接口当前由 MSW 提供数据，后端补齐后切真实。

## 认证（authnexussvr —— 空壳，最高优先）

| 接口                                      | 现状 | 契约                                                    |
| ----------------------------------------- | ---- | ------------------------------------------------------- |
| `POST /authnexus/v1/auth/login`           | 空壳 | `docs/auth-contract.md`                                 |
| `POST /authnexus/v1/auth/select-tenant`   | 空壳 | 同上                                                    |
| `POST /authnexus/v1/auth/refresh`         | 空壳 | 同上（httpOnly cookie）                                 |
| `POST /authnexus/v1/auth/logout`          | 空壳 | 同上                                                    |
| `GET /authnexus/v1/auth/profile`          | 空壳 | 同上                                                    |
| `POST /authnexus/v1/auth/change-password` | 空壳 | 同上                                                    |
| `POST /authnexus/v1/user/set-password`    | 空壳 | 同上                                                    |
| 登录状态两张表                            | 无   | `tenant_login_state` / `user_login_state`（见契约文档） |

## identityhubsvr

| 缺失                         | 说明                                                               | 前端当前                     |
| ---------------------------- | ------------------------------------------------------------------ | ---------------------------- |
| `ListUser` / `SearchUser`    | `UserService` 仅 Create/Update/Get/Delete 4 个 RPC                 | **Mock**（成员表格无数据源） |
| `EnableUser` / `DisableUser` | 实体有 `Enable()`/`Disable()` 但未暴露                             | 待补                         |
| `ListSecurityGroup`          | 安全组仅 Create/Update/Get/Delete                                  | **Mock**                     |
| 用户-组织关系                | `SetPrimaryOrg`/`AddSecondaryOrg`/`ListUserByOrg` 文档有、proto 无 | 待补                         |
| 安全组成员绑定               | 完全缺失                                                           | 待补                         |
| 角色/权限                    | 后端零授权原语                                                     | 前端仅占位                   |

## tenantmanagersvr（编译失败）

| 接口                                   | 现状                   | 前端当前               |
| -------------------------------------- | ---------------------- | ---------------------- |
| `GET /tenantmanager/v1/tenant/get`     | 服务编译失败（6 错误） | **Mock**（企业信息页） |
| `POST /tenantmanager/v1/tenant/create` | 同上                   | **Mock**               |

## 切真实联调方式

1. 后端补齐后，前端关 mock：`npm run dev`（不带 `--mode mock`）
2. `vite.config.ts` 代理 `/api → http://localhost:8888` 已就位
3. `src/api/*` 契约不变（路由/字段已按真实核对）
