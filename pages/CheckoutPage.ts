import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly countryInput: Locator;
  readonly placeOrderButton: Locator;
  readonly cvvInput: Locator;
  readonly nameOnCardInput: Locator;
  readonly creditCardInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.countryInput = page.locator('[placeholder="Select Country"]');
    this.placeOrderButton = page.locator('.action__submit');
    this.cvvInput = page.locator('[placeholder="enter CVV number"]');
    this.nameOnCardInput = page.locator('[placeholder="enter name on card"]');
    this.creditCardInput = page.locator('input:not([placeholder])').first();
  }

  async selectCountry(country: string) {
    await this.countryInput.type(country, { delay: 100 });
    const countryOption = this.page.locator('.ta-item').filter({ hasText: country }).first();
    await countryOption.click();
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }

  async fillPaymentDetails(creditCardNumber: string, cvv: string, nameOnCard: string) {
    await this.creditCardInput.fill(creditCardNumber);
    await this.cvvInput.fill(cvv);
    await this.nameOnCardInput.fill(nameOnCard);
  }

  getConfirmationMessage(): Locator {
    return this.page.locator('.hero-primary');
  }

  getOrderId(): Locator {
    return this.page.locator('.em-spacer-1 .ng-star-inserted');
  }
}
