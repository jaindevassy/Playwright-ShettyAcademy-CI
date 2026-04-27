import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cartSection h3');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async isProductInCart(productName: string): Promise<boolean> {
    await this.cartItems.first().waitFor({ state: 'visible', timeout: 10000 });
    return this.page
      .locator('.cartSection')
      .filter({ hasText: productName })
      .isVisible();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async removeItem(productName: string) {
    await this.page
      .locator('.cartSection')
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Delete' })
      .click();
  }
}
