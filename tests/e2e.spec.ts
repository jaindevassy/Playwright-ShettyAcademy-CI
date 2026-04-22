import { test, expect } from '../fixtures/baseTest';

test('user can login and add product to cart', async ({
  loginPage,
  dashboardPage,
  cartPage,
}) => {
  await loginPage.navigate();
  await loginPage.loginWithEnvCredentials();

  await expect(dashboardPage.cartIcon).toBeVisible();

  await dashboardPage.addProductToCart('ZARA COAT 3');
  await dashboardPage.goToCart();

  expect(await cartPage.isProductInCart('ZARA COAT 3')).toBeTruthy();
});

test('api - login returns a valid token', async ({ apiUtils }) => {
  const token = await apiUtils.getLoginTokenWithEnvCredentials();
  expect(token).toBeTruthy();
});
