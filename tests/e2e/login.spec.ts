import { expect, test } from '@playwright/test';

// 登录账号 = 租户 domain（7 位数字）。Mock 见 src/mocks/fixtures/auth.ts。
// 域标识 1000001 · 密码 admin123（租户认证/管理员）

test('以租户 domain 登录进入控制台', async ({ page }) => {
  await page.goto('/');

  // 未登录访问控制台 → 被守卫重定向到登录页
  await expect(page).toHaveURL(/\/login/);

  await page.getByLabel('域标识').fill('1000001');
  await page.getByLabel('密码').fill('admin123');
  await page.getByRole('button', { name: /登\s*录/ }).click();

  await expect(page).toHaveURL(/\/overview/);
  await expect(page.getByText('欢迎使用租户控制台')).toBeVisible();
  await expect(page.getByText('1000001')).toBeVisible();
});

test('错误密码提示 1004', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('域标识').fill('1000001');
  await page.getByLabel('密码').fill('wrong-password');
  await page.getByRole('button', { name: /登\s*录/ }).click();

  await expect(page.getByText('域标识或密码错误')).toBeVisible();
});

test('不存在的域标识提示 1003', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('域标识').fill('9999999');
  await page.getByLabel('密码').fill('admin123');
  await page.getByRole('button', { name: /登\s*录/ }).click();

  await expect(page.getByText('企业不存在')).toBeVisible();
});
