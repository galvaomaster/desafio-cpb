import { test, expect } from '../../src/fixtures';
import { parsePrice } from '../../src/utils/price';

test.describe('Frente 4 - Compra de ponta a ponta', () => {
  // A fixture `account` cria a conta pela API antes do teste e apaga depois.
  test('conta criada pela API faz login na tela, compra e recebe a confirmação', { tag: ['@smoke', '@regression'] }, async ({
    page, products, account, loginPage, productPage, cartPage, checkoutPage, paymentPage,
  }) => {
    const product = products[0];
    const quantity = 2;
    const expectedTotal = parsePrice(product.price) * quantity;

    await test.step('entrar pela tela', async () => {
      await loginPage.login(account.email, account.password);
      await expect(loginPage.loggedInAs).toContainText(account.name);
    });

    await test.step('adicionar ao carrinho', async () => {
      await productPage.addToCart(product.id, quantity);
      await cartPage.open();
      expect(parsePrice((await cartPage.readRow(product.id)).total)).toBe(expectedTotal);
    });

    await test.step('checkout mostra o endereço da API e o mesmo total', async () => {
      await cartPage.proceedToCheckout();
      await expect(checkoutPage.deliveryAddress).toContainText(account.address1);
      await expect(checkoutPage.deliveryAddress).toContainText(account.city);
      expect(parsePrice(await checkoutPage.total.innerText())).toBe(expectedTotal);
    });

    await test.step('pagar e conferir a confirmação', async () => {
      await checkoutPage.placeOrder();
      await paymentPage.payWithFakeCard();
      await expect(paymentPage.orderPlaced).toBeVisible();
      await expect(page.getByText('Congratulations! Your order has been confirmed!')).toBeVisible();
    });

    await test.step('carrinho fica vazio depois do pedido', async () => {
      await cartPage.open();
      await expect(cartPage.rows).toHaveCount(0);
    });
  });
});
