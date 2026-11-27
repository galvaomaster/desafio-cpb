import { Locator, Page } from '@playwright/test';

/** Tela /login. */
export class LoginPage {
  readonly loggedInAs: Locator;

  constructor(private readonly page: Page) {
    this.loggedInAs = page.getByText(/Logged in as/);
  }

  async login(email: string, password: string) {
    await this.page.goto('/login');
    await this.page.locator('[data-qa="login-email"]').fill(email);
    await this.page.locator('[data-qa="login-password"]').fill(password);
    await this.page.locator('[data-qa="login-button"]').click();
  }
}
