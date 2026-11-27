import { Locator, Page } from '@playwright/test';

/** Tela /payment: dados do cartão (fictícios) e confirmação do pedido. */
export class PaymentPage {
  readonly orderPlaced: Locator;

  constructor(private readonly page: Page) {
    this.orderPlaced = page.locator('[data-qa="order-placed"]');
  }

  /** Cartão de teste público (4111...), sem valor real. */
  async payWithFakeCard() {
    await this.page.locator('[data-qa="name-on-card"]').fill('QA Ficticio');
    await this.page.locator('[data-qa="card-number"]').fill('4111111111111111');
    await this.page.locator('[data-qa="cvc"]').fill('123');
    await this.page.locator('[data-qa="expiry-month"]').fill('12');
    await this.page.locator('[data-qa="expiry-year"]').fill('2030');
    await this.page.locator('[data-qa="pay-button"]').click();
  }
}
