import { beforeEach, describe, expect, it } from 'vitest';
import { use_scope } from '@/stores/scope';

describe('scope store', () => {
  beforeEach(() => {
    use_scope.getState().clear_scope();
  });

  it('初始作用域为空', () => {
    const state = use_scope.getState();
    expect(state.tenant_id).toBeNull();
    expect(state.directory_domain).toBeNull();
  });

  it('set_tenant 设置租户并清空目录域', () => {
    use_scope.getState().set_directory_domain('1000001');
    use_scope
      .getState()
      .set_tenant({ tenant_id: 't_1', tenant_domain: '1000002', ui_language: 'en_US' });
    const state = use_scope.getState();
    expect(state.tenant_id).toBe('t_1');
    expect(state.tenant_domain).toBe('1000002');
    expect(state.ui_language).toBe('en_US');
    // 切换租户 → 目录域必须清空（目录域属于租户作用域）
    expect(state.directory_domain).toBeNull();
  });

  it('set_directory_domain 设置目录域', () => {
    use_scope
      .getState()
      .set_tenant({ tenant_id: 't_1', tenant_domain: '1000001', ui_language: 'zh_CN' });
    use_scope.getState().set_directory_domain('1000001');
    expect(use_scope.getState().directory_domain).toBe('1000001');
  });
});
