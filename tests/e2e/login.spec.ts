import { expect, test } from '@playwright/test';

// 登录账号 = 租户管理员名称（name）。Mock 见 src/mocks/fixtures/auth.ts。
// 名称 admin · 密码 admin123（租户认证/管理员）

test('以名称登录进入控制台', async ({ page }) => {
  await page.goto('/');

  // 未登录访问控制台 → 被守卫重定向到登录页
  await expect(page).toHaveURL(/\/login/);

  await page.getByLabel('名称').fill('admin');
  await page.getByLabel('密码').fill('admin123');
  await page.getByRole('button', { name: /登\s*录/ }).click();

  await expect(page).toHaveURL(/\/overview/);
  await expect(page.getByText('欢迎使用租户控制台')).toBeVisible();
});

test('错误密码提示 1004', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('名称').fill('admin');
  await page.getByLabel('密码').fill('wrong-password');
  await page.getByRole('button', { name: /登\s*录/ }).click();

  await expect(page.getByText('名称或密码错误')).toBeVisible();
});
