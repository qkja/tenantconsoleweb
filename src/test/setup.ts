import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// 每个用例后卸载组件树，避免 DOM 残留污染下一用例。
afterEach(() => {
  cleanup();
});
