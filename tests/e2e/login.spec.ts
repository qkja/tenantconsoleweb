import { expect, test } from '@playwright/test';

// Mock 账号：admin / admin123（多企业）· member / member123（单企业）
// 见 src/mocks/fixtures/auth.ts。

test('admin 登录 → 选择企业 → 进入概览', async ({ page }) => {
  await page.goto('/');

  // 未登录访问控制台 → 被守卫重定向到登录页
  await expect(page).toHaveURL(/\/login/);

  await page.getByLabel('账号').fill('admin');
  await page.getByLabel('密码').fill('admin123');
  await page.getByRole('button', { name: /登\s*录/ }).click();

  // 多企业 → 「选择企业」
  await expect(page.getByText('选择企业')).toBeVisible();
  await page.getByRole('button', { name: '示例科技有限公司' }).click();

  await expect(page).toHaveURL(/\/overview/);
  await expect(page.getByText('欢迎使用租户控制台')).toBeVisible();
});

test('member 单企业直接进入概览', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('账号').fill('member');
  await page.getByLabel('密码').fill('member123');
  await page.getByRole('button', { name: /登\s*录/ }).click();

  await expect(page).toHaveURL(/\/overview/);
});

test('错误密码提示 1004', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('账号').fill('admin');
  await page.getByLabel('密码').fill('wrong-password');
  await page.getByRole('button', { name: /登\s*录/ }).click();

  await expect(page.getByText('账号或密码错误')).toBeVisible();
});
