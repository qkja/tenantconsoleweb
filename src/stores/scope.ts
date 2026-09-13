import { create } from 'zustand';
import type { UILanguage } from '@/types/auth';

/**
 * 控制台作用域 —— 当前租户 + 当前目录域（均以 code 寻址）。
 * 类比云控制台「地域」切换：切换后内容区数据作用域随之改变。
 * 请求层从本 store 读取 tenant_code/directory_code 注入 t-head-* 头。
 */
interface ScopeStore {
  tenant_code: string | null;
  /** 目录域 code（`dir_`；Directory/Organization/User/UserRole 作用域第二键）。 */
  directory_code: string | null;
  ui_language: UILanguage;

  set_tenant: (params: { tenant_code: string; ui_language: UILanguage }) => void;
  set_directory_code: (directory_code: string) => void;
  clear_scope: () => void;
}

const initial_scope = {
  tenant_code: null,
  directory_code: null,
  ui_language: 'zh_CN' as UILanguage,
};

export const use_scope = create<ScopeStore>((set) => ({
  ...initial_scope,

  // 切换租户时清空目录域（目录域属于租户作用域）。
  set_tenant: ({ tenant_code, ui_language }) =>
    set({ tenant_code, ui_language, directory_code: null }),

  set_directory_code: (directory_code) => set({ directory_code }),

  clear_scope: () => set(initial_scope),
}));
