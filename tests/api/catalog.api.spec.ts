import { test, expect } from '../../src/fixtures';
import { SEARCH_TERMS } from '../../src/data/test-data';

test.describe('Frente 2 - Catálogo e busca: API', () => {
  test('productsList devolve a estrutura esperada', { tag: ['@smoke', '@regression'] }, async ({ api }) => {
    const res = await api.getProducts();

    expect(res.http).toBe(200);
    expect(res.code).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);
    for (const product of res.body.products) {
      expect(product).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        price: expect.stringMatching(/^Rs\. \d+$/),
        brand: expect.any(String),
        category: { usertype: { usertype: expect.any(String) }, category: expect.any(String) },
      });
    }
  });

  // Data-driven: termos montados a partir de um produto real
  for (const { label, make } of SEARCH_TERMS) {
    test(`searchProduct (${label}) encontra o produto`, { tag: ['@regression'] }, async ({ api, products }) => {
      const product = products[0];
      const res = await api.searchProduct(make(product.name));

      expect(res.http).toBe(200);
      expect(res.code).toBe(200);
      expect(res.body.products.map((p: { id: number }) => p.id)).toContain(product.id);
    });
  }

  test('searchProduct sem parâmetro: corpo informa 400', { tag: ['@regression'] }, async ({ api }) => {
    const res = await api.searchProduct();

    expect(res.code).toBe(400);
    expect(res.message).toBe('Bad request, search_product parameter is missing in POST request.');
  });

  test('searchProduct sem parâmetro: status HTTP igual ao código do corpo', { tag: ['@regression', '@known-bug'] }, async ({ api }) => {
    test.fail(true, 'OBS-001: a API responde HTTP 200 com responseCode 400 no corpo');
    const res = await api.searchProduct();

    expect(res.http).toBe(res.code);
  });
});
