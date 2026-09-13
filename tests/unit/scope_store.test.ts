import { beforeEach, describe, expect, it } from 'vitest';
import { use_scope } from '@/stores/scope';

describe('scope store', () => {
  beforeEach(() => {
    use_scope.getState().clear_scope();
  });

  it('初始作用域为空', () => {
    const state = use_scope.getState();
    expect(state.tenant_code).toBeNull();
    expect(state.directory_code).toBeNull();
  });

  it('set_tenant 设置租户并清空目录域', () => {
    use_scope.getState().set_directory_code('dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP');
    use_scope
      .getState()
      .set_tenant({ tenant_code: 'tnt_01HX8ZK3M9QF2V7N4B6TCD1RWP', ui_language: 'en_US' });
    const state = use_scope.getState();
    expect(state.tenant_code).toBe('tnt_01HX8ZK3M9QF2V7N4B6TCD1RWP');
    expect(state.ui_language).toBe('en_US');
    // 切换租户 → 目录域必须清空（目录域属于租户作用域）
    expect(state.directory_code).toBeNull();
  });

  it('set_directory_code 设置目录域', () => {
    use_scope
      .getState()
      .set_tenant({ tenant_code: 'tnt_01HX8ZK3M9QF2V7N4B6TCD1RWP', ui_language: 'zh_CN' });
    use_scope.getState().set_directory_code('dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP');
    expect(use_scope.getState().directory_code).toBe('dir_01HX8ZK5Q2RB3X0F6S8VZD4NCP');
  });
});
