import { test, expect } from '../fixtures/baseTest';
import loginData from './testData/loginData.json';

test.describe('Login Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('Positive: Valid credentials should navigate to dashboard', async ({ loginPage, page }) => {
    await loginPage.login(loginData.validUser.email, loginData.validUser.password);
    await expect(page).toHaveURL(/dashboard/);
  });

  for (const { scenario, email, password, expectedError, errorLocator } of loginData.invalidCredentials) {
    test(`Negative: ${scenario}`, async ({ loginPage }) => {
      await loginPage.login(email, password);
      const errorElement = errorLocator === 'toast'
        ? loginPage.toastMessage
        : loginPage.errorMessage.first();
      await expect(errorElement).toBeVisible();
      await expect(errorElement).toContainText(expectedError);
    });
  }

});
