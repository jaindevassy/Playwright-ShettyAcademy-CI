import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly cartIcon: Locator;
  readonly orderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator('.card-body');
    this.cartIcon = page.locator('[routerlink="/dashboard/cart"]');
    this.orderButton = page.getByRole('button', { name: 'Orders' });
  }

  getProductByName(name: string): Locator {
    return this.productCards.filter({ hasText: name });
  }

  getAddToCartButton(productName: string): Locator {
    return this.getProductByName(productName).getByRole('button', { name: 'Add To Cart' });
  }

  async addProductToCart(productName: string) {
    await this.getAddToCartButton(productName).click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async goToOrders() {
    await this.orderButton.click();
  }

  getAllProductTitles(): Locator {
    return this.productCards.locator('h5 b');
  }
}
