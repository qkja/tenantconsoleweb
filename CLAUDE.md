# CLAUDE.md — tenantconsoleweb

租户控制台前端。形态对标企业微信管理后台：企业=租户、管理员登录=租户认证、成员登录=用户认证、通讯录=组织架构+成员。工程约定对齐 `identityhubsvr`（`openplatformsvr` 因走 go-zero 排除在一致性要求外）。

## 技术栈

React 19 · TypeScript 5.9 · Vite 8 · antd 5.29 · ProComponents（pro-table/pro-form/pro-card/pro-descriptions）· React Router 7 · TanStack Query 5 · Zustand 5 · 原生 fetch · MSW 2 · Vitest · Playwright · npm

## 常用命令

| 命令                                          | 说明                                          |
| --------------------------------------------- | --------------------------------------------- |
| `npm run dev`                                 | 开发（真实后端经 vite 代理 `/api` → `:8888`） |
| `npm run dev:mock`                            | Mock 模式（MSW，无需后端）                    |
| `npm run build`                               | `tsc -b && vite build`                        |
| `npm run lint` / `format` / `style`           | ESLint / Prettier / Stylelint                 |
| `npm run test` / `test:coverage` / `test:e2e` | 单元 / 覆盖率 / E2E                           |

## 命名规范（强制，ESLint 执行）

| 类别                | 命名                               | 示例                               |
| ------------------- | ---------------------------------- | ---------------------------------- |
| 变量 / 参数 / 属性  | `snake_case`                       | `tenant_id`、`fetch_user(user_id)` |
| 模块级常量          | `UPPER_SNAKE_CASE`                 | `API_BASE`                         |
| 类型 / 接口 / 枚举  | `PascalCase`                       | `UserInfo`                         |
| React 组件          | `PascalCase`                       | `MemberTable`                      |
| Hooks               | `use_` 前缀 + snake_case           | `use_user_list`                    |
| 文件                | `snake_case.ts` / `PascalCase.tsx` | `api/client.ts`                    |
| CSS 类 / 自定义属性 | `kebab-case`                       | `--color-surface`                  |

**例外（库强制 camelCase，保留原样）**：antd `dataIndex`、TanStack `queryKey`、React `onClick`。ESLint 仅对自有代码生效。
**例外（契约强制 camelCase）**：`src/types/tenantmanager.ts` —— protojson 大小写敏感，写错**静默丢字段**。该文件头有 eslint-disable 注释。

## 后端契约要点（不遵守必出 bug）

1. **业务错误走 HTTP 200**，`code` 为字符串 `"0"` 表成功。判定顺序收敛在 `src/api/client.ts`：429+非JSON→RateLimit → 非200→Transport → `code!="0"`→Biz。**绝不依赖 HTTP 状态判业务成败。**
2. **字段命名双制**：identityhub `snake_case`，tenantmanager `camelCase`。两类类型物理隔离（`types/identityhub.ts` vs `types/tenantmanager.ts`）。
3. **Update 是全量覆盖非 patch**：表单必须 load-then-merge 全量提交。
4. **限流 10 QPS 全局**（identityhubsvr）：树展开 / 批量操作必须串行或节流。
5. 状态值 `enable` / `disable`（不是 enabled/disabled）。
6. 分页结构不一致：Directory `{total,list}` vs Org `{list,total,page,page_size}` —— 归一化适配层处理。
7. `msg` 恒中文：按 `code` 映射文案，`msg` 仅兜底。
8. 请求头 `t-head-tenantId` / `t-head-userId` / `t-head-tenantLanguage` / `t-head-tenantUILanguage` 从会话态注入。

## 安全硬性要求

- **token 绝不写 localStorage**：access token 仅存内存（Zustand 非持久化）；refresh token 为 httpOnly Cookie；刷新页面调 `/refresh` 重建会话。
- 全部 `t-head-*` 头由 `api/client.ts` 统一注入，业务代码不得手写。

## 目录结构

```
src/
├── router/        路由 + 守卫
├── api/           client(envelope/错误处理) + 各域 API
├── types/         identityhub.ts(snake) · tenantmanager.ts(camel)
├── stores/        session · scope
├── hooks/queries/ TanStack Query hooks
├── layouts/       ConsoleLayout · TopBar · SideNav
├── features/      auth · overview · directory · organization · member · security_group · tenant
├── components/    ui · OrgTree · DataTable
├── styles/        tokens.css · typography.css · global.css
└── mocks/         MSW handlers + fixtures
docs/              认证契约文档 · 后端待补接口清单
tests/             unit · e2e
```

## 后端待补接口

见 `docs/backend-gap-list.md`。认证全套后端不存在 → 契约文档先评审，MSW 长期驻留（切真实后端仅需关 mock + 改 baseURL）。
