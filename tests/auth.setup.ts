import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '..', '.auth', 'user.json');

setup('authenticate', async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}/#/auth/login`);
  await page.locator('[placeholder="email@example.com"]').fill(process.env.USER_EMAIL!);
  await page.locator('[placeholder="enter your passsword"]').fill(process.env.USER_PASSWORD!);
  await page.locator('[value="Login"]').click();

  await expect(page.locator('[routerlink="/dashboard/cart"]')).toBeVisible();

  await page.context().storageState({ path: authFile });
});
