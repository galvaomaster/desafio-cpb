import { test, expect } from '../../src/fixtures';
import { VALID_QUANTITIES } from '../../src/data/test-data';
import { parsePrice } from '../../src/utils/price';

// Cada teste abre um navegador novo, então o carrinho de visitante começa vazio.
test.describe('Frente 1 - Carrinho de visitante', () => {
  test('produto adicionado aparece com nome, preço, quantidade e total', { tag: ['@smoke', '@regression'] }, async ({ products, productPage, cartPage }) => {
    const product = products[0];

    await productPage.addToCart(product.id, 1);
    await cartPage.open();

    expect(await cartPage.readRow(product.id)).toEqual({
      name: product.name,
      price: product.price,
      quantity: '1',
      total: product.price,
    });
  });

  // Data-driven: total = preço da API x quantidade
  for (const quantity of VALID_QUANTITIES) {
    test(`quantidade ${quantity}: total = preço x quantidade`, { tag: ['@regression'] }, async ({ products, productPage, cartPage }) => {
      const product = products[1];

      await productPage.addToCart(product.id, quantity);
      await cartPage.open();

      const row = await cartPage.readRow(product.id);
      expect(row.quantity).toBe(String(quantity));
      expect(parsePrice(row.total)).toBe(parsePrice(product.price) * quantity);
    });
  }

  test('quantidade negativa não entra no carrinho', { tag: ['@regression', '@known-bug'] }, async ({ page, products, productPage, cartPage }) => {
    test.fail(true, 'OBS-003: o carrinho aceita quantidade -1 e mostra total negativo');
    const product = products[2];

    // Não usa addToCart (que espera o modal de sucesso): se o fornecedor corrigir e o modal
    // não aparecer, o teste precisa ficar vermelho, e não dar timeout.
    await productPage.open(product.id);
    await productPage.quantity.fill('-1');
    const request = page.waitForResponse((r) => r.url().includes('/add_to_cart/'), { timeout: 5_000 }).catch(() => null);
    await productPage.addButton.click();
    await request;
    await cartPage.open();

    await expect(cartPage.row(product.id)).toHaveCount(0);
  });

  test('remover o único item deixa o carrinho vazio', { tag: ['@smoke', '@regression'] }, async ({ products, productPage, cartPage }) => {
    const product = products[3];

    await productPage.addToCart(product.id);
    await cartPage.open();
    await cartPage.remove(product.id);

    await expect(cartPage.emptyMessage).toBeVisible();
  });

  test('remover um item mantém os outros', { tag: ['@regression'] }, async ({ products, productPage, cartPage }) => {
    const [first, second] = [products[4], products[5]];

    await productPage.addToCart(first.id, 1);
    await productPage.addToCart(second.id, 2);
    await cartPage.open();
    await cartPage.remove(first.id);

    await expect(cartPage.rows).toHaveCount(1);
    expect((await cartPage.readRow(second.id)).quantity).toBe('2');
  });
});
