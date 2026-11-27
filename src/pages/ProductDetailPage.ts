import { Locator, Page } from '@playwright/test';

/** Tela /product_details/{id}: escolhe a quantidade e adiciona ao carrinho. */
export class ProductDetailPage {
  readonly name: Locator;
  readonly price: Locator;
  readonly quantity: Locator;
  readonly addButton: Locator;
  readonly modal: Locator;

  constructor(private readonly page: Page) {
    this.name = page.locator('.product-information h2');
    this.price = page.locator('.product-information span span').first();
    this.quantity = page.locator('#quantity');
    this.addButton = page.locator('button.cart');
    this.modal = page.locator('#cartModal');
  }

  async open(productId: number) {
    await this.page.goto(`/product_details/${productId}`);
    await this.addButton.waitFor();
  }

  /** Abre o produto, adiciona com a quantidade informada e fecha o modal de confirmação. */
  async addToCart(productId: number, quantity = 1) {
    await this.open(productId);
    await this.quantity.fill(String(quantity));
    const request = this.page.waitForResponse((r) => r.url().includes('/add_to_cart/'));
    await this.addButton.click();
    await request;
    await this.modal.locator('button.close-modal').click();
    await this.modal.waitFor({ state: 'hidden' });
  }
}
