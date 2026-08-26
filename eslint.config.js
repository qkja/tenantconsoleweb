// @ts-check
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules', 'playwright-report', 'test-results', 'public'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    languageOptions: {
      ecmaVersion: 2022,
    },
    rules: {
      /**
       * 命名规范 —— 用户显式指令：变量/属性统一下划线 snake_case。
       * 例外（本规则集内放宽）：
       *   1. 类型/接口/枚举 → PascalCase（typeLike / enumMember）
       *   2. React 组件与自定义 hook 名 → PascalCase（function/variable 允许）
       *   3. 模块级常量 → UPPER_SNAKE_CASE
       *   4. 解构出的第三方库 camelCase 名（如 antd 的 onCancel/dataIndex）→ 不约束
       * 例外（文件级，eslint-disable 注释）：
       *   5. types/tenantmanager.ts 契约强制 camelCase（protojson 大小写敏感）
       */
      '@typescript-eslint/naming-convention': [
        'error',
        // 类型/接口/枚举 → PascalCase
        { selector: 'typeLike', format: ['PascalCase'] },
        // 接口/类型声明字段 → snake_case（identityhub 契约；tenantmanager.ts 例外；
        // i18n 字典的「点分 key」如 'nav.member' 通过 filter 豁免）
        {
          selector: 'typeProperty',
          format: ['snake_case'],
          filter: { regex: '^[^.]+$', match: true },
        },
        // 枚举成员 → PascalCase
        { selector: 'enumMember', format: ['PascalCase'] },
        // 函数与变量：snake_case 为主，PascalCase 仅允许组件名，UPPER_CASE 允许模块常量
        { selector: ['function', 'variable'], format: ['snake_case', 'PascalCase', 'UPPER_CASE'] },
        // 参数严格 snake_case
        { selector: ['parameter', 'parameterProperty'], format: ['snake_case'] },
        // 解构变量/参数（多来自库对象）→ 不约束
        { selector: 'variable', modifiers: ['destructured'], format: null },
        { selector: 'parameter', modifiers: ['destructured'], format: null },
        // 未使用参数/变量（如 antd 校验器的 `_`）→ 不约束
        { selector: ['variable', 'parameter'], modifiers: ['unused'], format: null },
      ],

      // 禁止残留调试输出；warn/error 级别的 console 保留（错误监控）
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // React 19 + 函数组件为主，禁用不必要的 React 作用域引用
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  // context 模块合法地同时导出 Provider 与 hooks，放宽 fast-refresh 告警。
  {
    files: ['src/lib/i18n.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
);
