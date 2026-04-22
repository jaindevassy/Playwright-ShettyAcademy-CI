import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly toastMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[placeholder="email@example.com"]');
    this.passwordInput = page.locator('[placeholder="enter your passsword"]');
    this.loginButton = page.locator('[value="Login"]');
    this.errorMessage = page.locator('.invalid-feedback');
    this.toastMessage = page.locator('#toast-container');
  }

  async navigate() {
    await this.page.goto(`${process.env.BASE_URL}/#/auth/login`);
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithEnvCredentials() {
    await this.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
  }
}
