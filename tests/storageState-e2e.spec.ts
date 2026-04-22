import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

const productName = 'ZARA COAT 3';

test('add product to cart, verify details and checkout @Smoke', async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}`);

  const dashboardPage = new DashboardPage(page);
  await expect(dashboardPage.cartIcon).toBeVisible();

  await dashboardPage.addProductToCart(productName);
  await page.locator('#toast-container').waitFor({ state: 'visible' });
  await dashboardPage.goToCart();

  const cartPage = new CartPage(page);
  const cartItem = page.locator('li').filter({ hasText: productName });
  await expect(cartItem).toBeVisible();

  await expect(cartItem.locator('h3')).toHaveText(productName);

  const priceText = await cartItem.locator('p').filter({ hasText: /^\$ \d+$/ }).textContent();
  expect(priceText?.trim()).toBeTruthy();

  await cartPage.proceedToCheckout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.selectCountry('Canada');
  await checkoutPage.placeOrder();

  await expect(checkoutPage.getConfirmationMessage()).toHaveText(/thankyou for the order/i);
});
