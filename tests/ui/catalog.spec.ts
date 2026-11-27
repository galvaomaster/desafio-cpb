import { test, expect } from '../../src/fixtures';
import { SEARCH_TERMS } from '../../src/data/test-data';

// A tela e a API devem mostrar os mesmos produtos.
test.describe('Frente 2 - Catálogo e busca: tela x API', () => {
  test('lista de produtos da tela é igual à da API', { tag: ['@smoke', '@regression'] }, async ({ products, productsPage }) => {
    await productsPage.open();
    const screen = await productsPage.getProducts();

    const expected = products.map((p) => ({ id: String(p.id), name: p.name, price: p.price }));
    expect(screen).toHaveLength(expected.length);
    expect(screen).toEqual(expect.arrayContaining(expected));
  });

  test('detalhe do produto mostra o nome e o preço da API', { tag: ['@regression'] }, async ({ products, productPage }) => {
    const product = products[products.length - 1];

    await productPage.open(product.id);

    await expect(productPage.name).toHaveText(product.name);
    await expect(productPage.price).toHaveText(product.price);
  });

  // Data-driven: mesma busca na tela e na API
  for (const { label, make } of SEARCH_TERMS) {
    test(`busca (${label}): tela e API trazem os mesmos produtos`, { tag: ['@regression'] }, async ({ api, products, productsPage }) => {
      const term = make(products[0].name);

      const apiIds = (await api.searchProduct(term)).body.products.map((p: { id: number }) => String(p.id));
      await productsPage.open();
      await productsPage.search(term);
      const screenIds = (await productsPage.getProducts()).map((p) => p.id);

      expect(screenIds.sort()).toEqual(apiIds.sort());
    });
  }

  test('busca sem resultado é vazia na tela e na API', { tag: ['@regression'] }, async ({ api, productsPage }) => {
    const term = `zzz_inexistente_${Date.now()}`;

    const apiProducts = (await api.searchProduct(term)).body.products;
    await productsPage.open();
    await productsPage.search(term);

    expect(apiProducts).toHaveLength(0);
    await expect(productsPage.cards).toHaveCount(0);
  });

  test('busca com espaços ao redor: tela e API trazem os mesmos produtos', { tag: ['@regression', '@known-bug'] }, async ({ api, products, productsPage }) => {
    test.fail(true, 'OBS-004: com espaços ao redor do termo, a tela e a API devolvem resultados diferentes');
    const term = ` ${products[0].name.split(' ').pop()} `;

    const apiIds = (await api.searchProduct(term)).body.products.map((p: { id: number }) => String(p.id));
    await productsPage.open();
    await productsPage.search(term);
    const screenIds = (await productsPage.getProducts()).map((p) => p.id);

    expect(screenIds.sort()).toEqual(apiIds.sort());
  });
});
