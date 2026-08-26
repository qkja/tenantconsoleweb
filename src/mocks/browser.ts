import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// MSW Service Worker —— Mock 模式唯一入口（main.tsx 动态 import 启动）。
// 阶段 3 起随契约文档逐条补充 handlers。
export const worker = setupWorker(...handlers);
