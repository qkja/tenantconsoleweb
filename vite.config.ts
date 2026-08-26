/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 构建 + 测试统一配置。vitest 配置内联于此（类型来自 vitest/config reference）。
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // 真实后端网关 :8888。开发期经 vite 代理转发 /api，规避后端 CORS 全开。
      // Mock 模式（VITE_USE_MOCKS=true）下 MSW 拦截浏览器请求，本代理不生效。
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: true,
    target: 'es2022',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/unit/**/*.test.{ts,tsx}'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // 质量门范围：api/hooks/stores 层（组件/页面由 Playwright E2E 覆盖）
      include: ['src/api/**', 'src/hooks/**', 'src/stores/**'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/api/index.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
