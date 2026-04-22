import { Page, Locator } from '@playwright/test';

export class OrdersPage {
  readonly page: Page;
  readonly orderRows: Locator;
  readonly orderIdCells: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderRows = page.locator('tbody tr');
    this.orderIdCells = page.locator('tbody tr th');
  }

  async getOrderCount(): Promise<number> {
    return this.orderRows.count();
  }

  async getLatestOrderId(): Promise<string> {
    return this.orderIdCells.first().innerText();
  }

  async viewOrderById(orderId: string) {
    await this.page
      .locator('tbody tr')
      .filter({ hasText: orderId })
      .locator('button', { hasText: 'View' })
      .click();
  }

  async isOrderPresent(orderId: string): Promise<boolean> {
    return this.page
      .locator('tbody tr th', { hasText: orderId })
      .isVisible();
  }

  getOrderDetailButton(orderId: string): Locator {
    return this.page
      .locator('tbody tr')
      .filter({ hasText: orderId })
      .locator('button', { hasText: 'View' });
  }

  async getOrderRowDetails(orderId: string): Promise<{ productName: string; price: string; date: string }> {
    const row = this.page.locator('tbody tr').filter({ hasText: orderId });
    return {
      productName: await row.locator('td:nth-child(3)').innerText(),
      price: await row.locator('td:nth-child(4)').innerText(),
      date: await row.locator('td:nth-child(5)').innerText(),
    };
  }

  getDeleteButton(orderId: string): Locator {
    return this.page
      .locator('tbody tr')
      .filter({ hasText: orderId })
      .locator('button', { hasText: 'Delete' });
  }
}
