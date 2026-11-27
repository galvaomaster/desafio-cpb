import { test, expect } from '../../src/fixtures';
import { buildUser } from '../../src/data/factories';

test.describe('Frente 3 - API de conta', () => {
  test('ciclo de vida: criar, consultar, entrar, atualizar e apagar', { tag: ['@smoke', '@regression'] }, async ({ api }) => {
    const user = buildUser();
    let deleted = false;

    try {
      await test.step('criar', async () => {
        const res = await api.createAccount(user);
        expect(res.http).toBe(200);
        expect(res.code).toBe(201);
        expect(res.message).toBe('User created!');
      });

      await test.step('consultar', async () => {
        const res = await api.getUserByEmail(user.email);
        expect(res.code).toBe(200);
        expect(res.body.user).toMatchObject({ name: user.name, email: user.email, city: user.city });
      });

      await test.step('entrar', async () => {
        const res = await api.verifyLogin(user.email, user.password);
        expect(res.code).toBe(200);
        expect(res.message).toBe('User exists!');
      });

      await test.step('atualizar', async () => {
        const updated = { ...user, city: 'Cidade Atualizada' };
        const res = await api.updateAccount(updated);
        expect(res.code).toBe(200);
        expect(res.message).toBe('User updated!');
        expect((await api.getUserByEmail(user.email)).body.user.city).toBe('Cidade Atualizada');
      });

      await test.step('apagar', async () => {
        const res = await api.deleteAccount(user.email, user.password);
        expect(res.code).toBe(200);
        expect(res.message).toBe('Account deleted!');
        deleted = true;
        expect((await api.verifyLogin(user.email, user.password)).code).toBe(404);
      });
    } finally {
      // Limpeza: se o teste parou antes de apagar, apaga aqui.
      if (!deleted) await api.deleteAccount(user.email, user.password);
    }
  });

  test('não cria duas contas com o mesmo e-mail', { tag: ['@regression'] }, async ({ api, account }) => {
    const res = await api.createAccount({ ...buildUser(), email: account.email });

    expect(res.code).toBe(400);
    expect(res.message).toBe('Email already exists!');
  });

  test('login com senha errada é recusado', { tag: ['@regression'] }, async ({ api, account }) => {
    const res = await api.verifyLogin(account.email, 'senha-errada');

    expect(res.code).toBe(404);
    expect(res.message).toBe('User not found!');
  });

  test('consulta da conta não devolve a senha', { tag: ['@regression'] }, async ({ api, account }) => {
    const res = await api.getUserByEmail(account.email);

    expect(res.body.user).not.toHaveProperty('password');
    expect(JSON.stringify(res.body)).not.toContain(account.password);
  });

  test('consulta sem autenticação não deve devolver endereço e nascimento', { tag: ['@regression', '@known-bug'] }, async ({ api, account }) => {
    test.fail(true, 'OBS-009: qualquer pessoa com o e-mail obtém endereço e data de nascimento');
    const res = await api.getUserByEmail(account.email);

    expect(res.body.user).not.toHaveProperty('address1');
    expect(res.body.user).not.toHaveProperty('birth_year');
  });
});
