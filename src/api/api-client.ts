import { APIRequestContext, APIResponse } from '@playwright/test';
import { UserData, isTestEmail } from '../data/factories';

export interface Product {
  id: number;
  name: string;
  price: string; // ex.: "Rs. 500"
  brand: string;
  category: { usertype: { usertype: string }; category: string };
}

/** Resposta da API com o status HTTP e o código que vem no corpo, para comparar os dois. */
export interface ApiResult {
  http: number;
  code?: number;
  message?: string;
  body: any;
}

async function toResult(res: APIResponse): Promise<ApiResult> {
  const text = await res.text();
  let body: any;
  try { body = JSON.parse(text); } catch { body = text; }
  return { http: res.status(), code: body?.responseCode, message: body?.message, body };
}

/** Chamadas da API usadas nos testes. */
export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  getProducts() {
    return this.request.get('/api/productsList').then(toResult);
  }

  searchProduct(term?: string) {
    const options = term === undefined ? {} : { form: { search_product: term } };
    return this.request.post('/api/searchProduct', options).then(toResult);
  }

  createAccount(user: UserData) {
    return this.request.post('/api/createAccount', { form: { ...user } }).then(toResult);
  }

  getUserByEmail(email: string) {
    return this.request.get('/api/getUserDetailByEmail', { params: { email } }).then(toResult);
  }

  verifyLogin(email: string, password: string) {
    return this.request.post('/api/verifyLogin', { form: { email, password } }).then(toResult);
  }

  updateAccount(user: UserData) {
    return this.request.put('/api/updateAccount', { form: { ...user } }).then(toResult);
  }

  /** Só apaga contas criadas pelos testes (ambiente compartilhado). */
  deleteAccount(email: string, password: string) {
    if (!isTestEmail(email)) throw new Error(`Conta não pertence aos testes: ${email}`);
    return this.request.delete('/api/deleteAccount', { form: { email, password } }).then(toResult);
  }

  /** Chamada com qualquer método, para testar métodos que a API não deveria aceitar. */
  send(method: string, url: string) {
    return this.request.fetch(url, { method }).then(toResult);
  }
}
