/** Dados dos testes data-driven. Os valores esperados (preço, nome, ID) vêm sempre da API. */

/** Quantidades válidas no carrinho (inteiro >= 1). */
export const VALID_QUANTITIES = [1, 2, 5];

/** Termos de busca montados a partir do nome de um produto real. */
export const SEARCH_TERMS = [
  { label: 'nome completo', make: (name: string) => name },
  { label: 'minúsculas', make: (name: string) => name.toLowerCase() },
  { label: 'primeira palavra', make: (name: string) => name.split(' ')[0] },
];

/** Métodos que cada rota não deveria aceitar (a lista oficial documenta um método por rota). */
export const UNSUPPORTED_METHODS = [
  { method: 'POST', url: '/api/productsList' },
  { method: 'PUT', url: '/api/brandsList' },
  { method: 'DELETE', url: '/api/verifyLogin' },
];
