import { test as base, expect } from '@playwright/test';
import { ApiClient, Product } from '../api/api-client';
import { UserData, buildUser } from '../data/factories';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { PaymentPage } from '../pages/PaymentPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { ProductsPage } from '../pages/ProductsPage';

type Fixtures = {
  api: ApiClient;
  products: Product[];
  account: UserData;
  productsPage: ProductsPage;
  productPage: ProductDetailPage;
  cartPage: CartPage;
  loginPage: LoginPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
};

export const test = base.extend<Fixtures>({
  // Bloqueia anúncios e fecha o pop-up de consentimento: os dois atrapalham os cliques.
  page: async ({ page }, use) => {
    await page.route(/googlesyndication|doubleclick|googleadservices|fundingchoicesmessages/, (route) => route.abort());
    await page.addLocatorHandler(page.locator('.fc-consent-root .fc-cta-consent'), (button) => button.click());
    await use(page);
  },

  api: async ({ request }, use) => {
    await use(new ApiClient(request));
  },

  // Lista de produtos lida da API: os testes não escrevem ID nem preço.
  products: async ({ api }, use) => {
    const res = await api.getProducts();
    expect(res.code).toBe(200);
    await use(res.body.products);
  },

  // Conta criada pela API antes do teste e apagada depois, mesmo se o teste falhar.
  account: async ({ api }, use) => {
    const user = buildUser();
    const created = await api.createAccount(user);
    expect(created.code, 'criar conta de teste').toBe(201);
    await use(user);
    await api.deleteAccount(user.email, user.password);
  },

  productsPage: async ({ page }, use) => { await use(new ProductsPage(page)); },
  productPage: async ({ page }, use) => { await use(new ProductDetailPage(page)); },
  cartPage: async ({ page }, use) => { await use(new CartPage(page)); },
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  checkoutPage: async ({ page }, use) => { await use(new CheckoutPage(page)); },
  paymentPage: async ({ page }, use) => { await use(new PaymentPage(page)); },
});

export { expect };
