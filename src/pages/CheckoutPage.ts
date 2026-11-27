import { Locator, Page } from '@playwright/test';

/** Tela /checkout: endereço de entrega, total e botão de fazer o pedido. */
export class CheckoutPage {
  readonly deliveryAddress: Locator;
  readonly total: Locator;

  constructor(private readonly page: Page) {
    this.deliveryAddress = page.locator('#address_delivery');
    this.total = page.locator('#cart_info .cart_total_price').last();
  }

  async placeOrder() {
    await this.page.locator('a[href="/payment"]').click();
    await this.page.waitForURL(/payment/);
  }
}
