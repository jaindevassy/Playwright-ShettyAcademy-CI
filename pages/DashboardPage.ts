import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly cartIcon: Locator;
  readonly searchInput: Locator;
  readonly orderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator('.card-body');
    this.cartIcon = page.locator('[routerlink="/dashboard/cart"]');
    this.searchInput = page.locator('.form-control');
    this.orderButton = page.locator('button[routerlink="/dashboard/myorders"]');
  }

  getProductByName(name: string): Locator {
    return this.page.locator('.card-body').filter({ hasText: name });
  }

  getAddToCartButton(productName: string): Locator {
    return this.getProductByName(productName).locator('button', { hasText: 'Add To Cart' });
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

  async searchProduct(name: string) {
    await this.searchInput.fill(name);
  }

  getAllProductTitles(): Locator {
    return this.page.locator('.card-body h5 b');
  }
}
