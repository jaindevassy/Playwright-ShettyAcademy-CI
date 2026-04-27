import { test, expect } from '../fixtures/baseTest';
import regressionData from './testData/regressionData.json';

test.describe('@Regression', () => {
  test('E2E - API order creation + UI order verification', async ({
    page,
    apiUtils,
    ordersPage,
    dashboardPage,
  }) => {
    // ── API SETUP ──────────────────────────────────────────────────────────────
    // Login via API and inject token into browser
    const token = await apiUtils.getLoginTokenWithEnvCredentials();
    await page.addInitScript((t) => window.localStorage.setItem('token', t), token);

    // Navigate to dashboard to capture product ID from the products API response
    const productsResponsePromise = page.waitForResponse(
      async (response) => {
        if (response.status() !== 200) return false;
        try {
          const json = await response.json();
          return Array.isArray(json?.data) && json.data.length > 0 && !!json.data[0]?._id;
        } catch { return false; }
      },
      { timeout: 15000 }
    );

    await page.goto(`${process.env.BASE_URL}`);
    await expect(dashboardPage.cartIcon).toBeVisible();

    const productsJson = await (await productsResponsePromise).json();
    const product = (productsJson.data as Array<{ productName: string; _id: string }>).find(
      (p) => p.productName.toLowerCase() === regressionData.product.toLowerCase()
    );
    expect(product, `"${regressionData.product}" not found in product listing`).toBeTruthy();

    // Create order via API and capture order ID
    const orderResult = await apiUtils.createOrder(token, product!._id, regressionData.payment.country);
    console.log('Order creation API response:', orderResult);
    const orderId = orderResult.orders[0] as string;
    expect(orderId, `createOrder failed: ${JSON.stringify(orderResult)}`).toBeTruthy();

    // ── UI VERIFICATION ────────────────────────────────────────────────────────
    // Navigate to the app and click Orders
    await page.goto(`${process.env.BASE_URL}`);
    await expect(dashboardPage.cartIcon).toBeVisible();
    await dashboardPage.goToOrders();
    await page.waitForSelector('tbody tr');

    // Verify order ID is present in the orders list
    await expect(page.locator('tbody tr th', { hasText: orderId })).toBeVisible();

    // Verify Delete button is active (enabled)
    const deleteBtn = ordersPage.getDeleteButton(orderId);
    await expect(deleteBtn).toBeVisible();
    await expect(deleteBtn).toBeEnabled();

    // Click View on the just-created order
    await ordersPage.viewOrderById(orderId);

    // Verify order ID on order detail page
    await expect(page.getByText(orderId)).toBeVisible();

    // Verify billing address - email and country
    const billingParent = page.getByText('Billing Address').locator('..');
    await expect(billingParent.getByText(regressionData.expectedEmail)).toBeVisible();
    await expect(billingParent.getByText(regressionData.payment.country)).toBeVisible();

    // Verify delivery address - email and country
    const deliveryParent = page.getByText('Delivery Address').locator('..');
    await expect(deliveryParent.getByText(regressionData.expectedEmail)).toBeVisible();
    await expect(deliveryParent.getByText(regressionData.payment.country)).toBeVisible();
  });
});
