import { test, expect } from '../fixtures/baseTest';

test.describe('@Smoke', () => {
  test.beforeEach(async ({ page, dashboardPage }) => {
    await page.goto(`${process.env.BASE_URL}`);
    await expect(dashboardPage.cartIcon).toBeVisible();
  });

  test('add ZARA COAT 3 to cart, verify details and checkout', async ({
    page,
    dashboardPage,
    cartPage,
    checkoutPage,
  }) => {
    const productName = 'ZARA COAT 3';

    await dashboardPage.addProductToCart(productName);
    await page.locator('#toast-container').waitFor({ state: 'visible' });
    await dashboardPage.goToCart();

    const cartItem = page.locator('li').filter({ hasText: productName });
    await expect(cartItem).toBeVisible();

    await expect(cartItem.locator('h3')).toHaveText(productName);

    const priceText = await cartItem.locator('p').filter({ hasText: /^\$ \d+$/ }).textContent();
    expect(priceText?.trim()).toBeTruthy();

    await cartPage.proceedToCheckout();

    await checkoutPage.selectCountry('Canada');
    await checkoutPage.placeOrder();

    await expect(checkoutPage.getConfirmationMessage()).toHaveText(/thankyou for the order/i);
  });

  test('buy iPhone 13 Pro with Austria as country', async ({
    page,
    dashboardPage,
    cartPage,
    checkoutPage,
  }) => {
    const productName = 'iphone 13 pro';

    await dashboardPage.addProductToCart(productName);
    await page.locator('#toast-container').waitFor({ state: 'visible' });
    await dashboardPage.goToCart();

    const cartItem = page.locator('li').filter({ hasText: productName });
    await expect(cartItem).toBeVisible();

    await expect(cartItem.locator('h3')).toHaveText(productName, { ignoreCase: true });

    const priceText = await cartItem.locator('p').filter({ hasText: /^\$ \d+$/ }).textContent();
    expect(priceText?.trim()).toBeTruthy();

    await cartPage.proceedToCheckout();

    await checkoutPage.selectCountry('Austria');
    await checkoutPage.placeOrder();

    await expect(checkoutPage.getConfirmationMessage()).toHaveText(/thankyou for the order/i);
  });
});
