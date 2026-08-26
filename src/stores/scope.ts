import { create } from 'zustand';
import type { UILanguage } from '@/types/auth';

/**
 * 控制台作用域 —— 当前租户 + 当前目录域。
 * 类比云控制台「地域」切换：切换后内容区数据作用域随之改变。
 * 请求层从本 store 读取 tenant_id/domain 注入 t-head-* 头。
 */
interface ScopeStore {
  tenant_id: string | null;
  tenant_domain: string | null;
  /** 目录域 7 位数字码（Directory/User 作用域第二键）。 */
  directory_domain: string | null;
  ui_language: UILanguage;

  set_tenant: (params: {
    tenant_id: string;
    tenant_domain: string;
    ui_language: UILanguage;
  }) => void;
  set_directory_domain: (directory_domain: string) => void;
  clear_scope: () => void;
}

const initial_scope = {
  tenant_id: null,
  tenant_domain: null,
  directory_domain: null,
  ui_language: 'zh_CN' as UILanguage,
};

export const use_scope = create<ScopeStore>((set) => ({
  ...initial_scope,

  // 切换租户时清空目录域（目录域属于租户作用域）。
  set_tenant: ({ tenant_id, tenant_domain, ui_language }) =>
    set({ tenant_id, tenant_domain, ui_language, directory_domain: null }),

  set_directory_domain: (directory_domain) => set({ directory_domain }),

  clear_scope: () => set(initial_scope),
}));
