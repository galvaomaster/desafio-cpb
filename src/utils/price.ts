/** Converte "Rs. 500" em 500. O ponto de "Rs." não é separador decimal, por isso o prefixo sai antes. */
export function parsePrice(price: string): number {
  return Number(price.replace('Rs.', '').replace(/,/g, '').trim());
}
