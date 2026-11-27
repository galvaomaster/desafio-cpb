import { Locator, Page } from '@playwright/test';

/** Tela /products: lista de produtos e busca. */
export class ProductsPage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly cards: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.cards = page.locator('.features_items .product-image-wrapper');
  }

  async open() {
    await this.page.goto('/products');
    await this.cards.first().waitFor();
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
    await this.page.waitForURL(/search=/);
  }

  /** Lê id, nome e preço de cada produto mostrado na tela. */
  async getProducts() {
    return this.cards.evaluateAll((cards) =>
      cards.map((card) => ({
        id: card.querySelector<HTMLElement>('a[data-product-id]')?.dataset.productId ?? '',
        name: card.querySelector('.productinfo p')?.textContent?.trim() ?? '',
        price: card.querySelector('.productinfo h2')?.textContent?.trim() ?? '',
      })),
    );
  }
}
