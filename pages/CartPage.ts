import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly deleteButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cartSection h3');
    this.checkoutButton = page.locator('button.btn.btn-primary', { hasText: 'Checkout' });
    this.deleteButtons = page.locator('.cart-edit');
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async isProductInCart(productName: string): Promise<boolean> {
    return this.page
      .locator('.cartSection h3', { hasText: productName })
      .isVisible();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async removeItem(productName: string) {
    await this.page
      .locator('.cartSection')
      .filter({ hasText: productName })
      .locator('.cart-edit')
      .click();
  }
}
