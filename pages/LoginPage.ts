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
    this.emailInput = page.getByPlaceholder('email@example.com');
    this.passwordInput = page.getByPlaceholder('enter your passsword');
    this.loginButton = page.getByRole('button', { name: 'Login' });
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
