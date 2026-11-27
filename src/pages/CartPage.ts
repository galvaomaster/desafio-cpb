import { Locator, Page } from '@playwright/test';

/** Tela /view_cart: linhas do carrinho, remoção e checkout. */
export class CartPage {
  readonly rows: Locator;
  readonly emptyMessage: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.rows = page.locator('#cart_info_table tbody tr');
    this.emptyMessage = page.locator('#empty_cart');
    this.checkoutButton = page.locator('a.check_out');
  }

  async open() {
    await this.page.goto('/view_cart');
  }

  row(productId: number) {
    return this.page.locator(`#product-${productId}`);
  }

  /** Lê nome, preço, quantidade e total da linha de um produto. */
  async readRow(productId: number) {
    const row = this.row(productId);
    return {
      name: await row.locator('.cart_description h4 a').innerText(),
      price: await row.locator('.cart_price p').innerText(),
      quantity: await row.locator('.cart_quantity button').innerText(),
      total: await row.locator('.cart_total_price').innerText(),
    };
  }

  async remove(productId: number) {
    await this.row(productId).locator('.cart_quantity_delete').click();
    await this.row(productId).waitFor({ state: 'detached' });
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForURL(/checkout/);
  }
}
