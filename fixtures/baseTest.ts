import { test as base, APIRequestContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrdersPage } from '../pages/OrdersPage';
import { ApiUtils } from '../pages/api/ApiUtils';

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  ordersPage: OrdersPage;
  apiUtils: ApiUtils;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  ordersPage: async ({ page }, use) => {
    await use(new OrdersPage(page));
  },

  apiUtils: async ({ request }, use) => {
    await use(new ApiUtils(request));
  },
});

export { expect } from '@playwright/test';
