import { Page, Locator } from '@playwright/test';

export class OrdersPage {
  readonly page: Page;
  readonly orderRows: Locator;
  readonly orderIdCells: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderRows = page.getByRole('row');
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
      .getByRole('row')
      .filter({ hasText: orderId })
      .getByRole('button', { name: 'View' })
      .click();
  }

  async isOrderPresent(orderId: string): Promise<boolean> {
    return this.page
      .getByRole('row')
      .filter({ hasText: orderId })
      .isVisible();
  }

  getOrderDetailButton(orderId: string): Locator {
    return this.page
      .getByRole('row')
      .filter({ hasText: orderId })
      .getByRole('button', { name: 'View' });
  }

  async getOrderRowDetails(orderId: string): Promise<{ productName: string; price: string; date: string }> {
    const row = this.page.getByRole('row').filter({ hasText: orderId });
    return {
      productName: await row.getByRole('cell').nth(2).innerText(),
      price: await row.getByRole('cell').nth(3).innerText(),
      date: await row.getByRole('cell').nth(4).innerText(),
    };
  }

  getDeleteButton(orderId: string): Locator {
    return this.page
      .getByRole('row')
      .filter({ hasText: orderId })
      .getByRole('button', { name: 'Delete' });
  }
}
