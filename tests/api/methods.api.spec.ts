import { test, expect } from '../../src/fixtures';
import { UNSUPPORTED_METHODS } from '../../src/data/test-data';

test.describe('Frente 3 - API: métodos não suportados', () => {
  // Data-driven: um teste por combinação de método e rota
  for (const { method, url } of UNSUPPORTED_METHODS) {
    test(`${method} ${url}: corpo informa 405`, { tag: ['@regression'] }, async ({ api }) => {
      const res = await api.send(method, url);

      expect(res.code).toBe(405);
      expect(res.message).toBe('This request method is not supported.');
    });

    test(`${method} ${url}: status HTTP deve ser 405`, { tag: ['@regression', '@known-bug'] }, async ({ api }) => {
      test.fail(true, 'OBS-001: a API responde HTTP 200 com responseCode 405 no corpo');
      const res = await api.send(method, url);

      expect(res.http).toBe(405);
    });
  }
});
